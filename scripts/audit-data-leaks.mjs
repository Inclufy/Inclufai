#!/usr/bin/env node
// audit-data-leaks.mjs — Supabase-oriented data-leak auditor (Node stdlib only)
//
// Usage:
//   node scripts/audit-data-leaks.mjs              # scan + diff vs baseline
//   node scripts/audit-data-leaks.mjs --write-baseline
//   node scripts/audit-data-leaks.mjs --all
//   node scripts/audit-data-leaks.mjs --json
//
// Exit codes:
//   0 = no new findings (or baseline updated, or --all)
//   1 = new P0/P1 findings vs baseline
//
// No npm dependencies. Node 18+.

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { createHash } from "node:crypto";

// ---------------------------------------------------------------------------
// Configuration — adjust per repo
// ---------------------------------------------------------------------------

// Sensitive tables that MUST have RLS enabled. Public-content tables (e.g.
// course_catalog) can be intentionally public-read; list them here ONLY if
// you want them enforced. Empty list = check all tables found.
// Top-N most-referenced tables in this repo (academy DB tables from
// complete-database-migration-v2.sql). Add a supabase/migrations/ tree and the
// auditor will start enforcing RLS for these names.
const TABLES = [
  "academy_user_learning_profiles",
  "academy_ai_threads",
  "academy_ai_messages",
  "academy_simulations",
  "academy_simulation_runs",
  "academy_skills",
  "academy_user_skills",
  "academy_certifications",
];

const MIGRATIONS_GLOB = "supabase/migrations/*.sql";
const FUNCTIONS_DIR = "supabase/functions";
const BASELINE_FILE = ".data-leak-baseline.json";

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const FLAG_WRITE = args.includes("--write-baseline");
const FLAG_ALL = args.includes("--all");
const FLAG_JSON = args.includes("--json");

const ROOT = process.cwd();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

function color(c, s) {
  return process.stdout.isTTY && !FLAG_JSON ? `${c}${s}${C.reset}` : s;
}

function fingerprint(file, line, checkId) {
  return createHash("sha256")
    .update(`${file}:${line}:${checkId}`)
    .digest("hex")
    .slice(0, 16);
}

function listFiles(dir, ext) {
  if (!existsSync(dir)) return [];
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    let entries;
    try {
      entries = readdirSync(d, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const p = join(d, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.isFile() && (!ext || p.endsWith(ext))) out.push(p);
    }
  }
  return out.sort();
}

function listMigrations() {
  const dir = join(ROOT, "supabase", "migrations");
  return listFiles(dir, ".sql");
}

function listEdgeFunctions() {
  const dir = join(ROOT, FUNCTIONS_DIR);
  return listFiles(dir, ".ts");
}

function readSafe(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

function rel(p) {
  return relative(ROOT, p) || p;
}

function lineNumber(content, idx) {
  return content.slice(0, idx).split("\n").length;
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

function checkMissingRLS() {
  const findings = [];
  const migrations = listMigrations();
  if (migrations.length === 0) return findings;

  const created = new Map(); // table -> {file, line}
  const rlsEnabled = new Set(); // table names with RLS
  const reCreate = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?["`]?(\w+)["`]?/gi;
  const reEnable = /ALTER\s+TABLE\s+(?:public\.)?["`]?(\w+)["`]?\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY/gi;

  for (const file of migrations) {
    const content = readSafe(file);
    let m;
    reCreate.lastIndex = 0;
    while ((m = reCreate.exec(content))) {
      const table = m[1];
      if (!created.has(table)) {
        created.set(table, { file, line: lineNumber(content, m.index) });
      }
    }
    reEnable.lastIndex = 0;
    while ((m = reEnable.exec(content))) {
      rlsEnabled.add(m[1]);
    }
  }

  for (const [table, loc] of created) {
    if (TABLES.length > 0 && !TABLES.includes(table)) continue;
    if (!rlsEnabled.has(table)) {
      findings.push({
        id: "MISSING_RLS",
        severity: "P0",
        file: rel(loc.file),
        line: loc.line,
        message: `Table public.${table} created without ENABLE ROW LEVEL SECURITY`,
        fingerprint: fingerprint(rel(loc.file), loc.line, "MISSING_RLS"),
      });
    }
  }
  return findings;
}

function checkPermissivePolicies() {
  const findings = [];
  const migrations = listMigrations();

  // Collect dropped policy names across all migrations (best-effort)
  const dropped = new Set();
  const reDrop = /DROP\s+POLICY\s+(?:IF\s+EXISTS\s+)?["`]?([^"`\s;]+)["`]?/gi;
  for (const file of migrations) {
    const content = readSafe(file);
    let m;
    reDrop.lastIndex = 0;
    while ((m = reDrop.exec(content))) dropped.add(m[1]);
  }

  const rePolicy =
    /CREATE\s+POLICY\s+["`]?([^"`\s]+)["`]?[\s\S]*?USING\s*\(\s*(true|auth\.role\(\)\s*=\s*'authenticated')\s*\)/gi;
  const rePermissiveOnly = /USING\s*\(\s*(true|auth\.role\(\)\s*=\s*'authenticated')\s*\)/gi;

  for (const file of migrations) {
    const content = readSafe(file);
    // Try matched policy-name first
    rePolicy.lastIndex = 0;
    let m;
    const matched = new Set();
    while ((m = rePolicy.exec(content))) {
      const name = m[1];
      const idx = m.index;
      matched.add(idx);
      if (dropped.has(name)) continue;
      const ln = lineNumber(content, idx);
      findings.push({
        id: "PERMISSIVE_POLICY",
        severity: "P0",
        file: rel(file),
        line: ln,
        message: `Permissive policy "${name}" with USING (${m[2]})`,
        fingerprint: fingerprint(rel(file), ln, "PERMISSIVE_POLICY"),
      });
    }
    // Catch standalone permissive USING() that didn't match the policy regex
    rePermissiveOnly.lastIndex = 0;
    while ((m = rePermissiveOnly.exec(content))) {
      if (matched.has(m.index)) continue;
      // Only flag if not already inside a matched policy
      const ln = lineNumber(content, m.index);
      const fp = fingerprint(rel(file), ln, "PERMISSIVE_POLICY");
      if (findings.some((f) => f.fingerprint === fp)) continue;
      findings.push({
        id: "PERMISSIVE_POLICY",
        severity: "P0",
        file: rel(file),
        line: ln,
        message: `Permissive USING (${m[1]}) clause`,
        fingerprint: fp,
      });
    }
  }
  return findings;
}

function checkAnonGrants() {
  const findings = [];
  const migrations = listMigrations();
  const re = /grant\s+(execute|select|insert|update|delete)\s+on\s+(\S+)\s+to\s+anon/gi;

  for (const file of migrations) {
    const content = readSafe(file);
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(content))) {
      const ln = lineNumber(content, m.index);
      findings.push({
        id: "ANON_GRANT",
        severity: "P1",
        file: rel(file),
        line: ln,
        message: `GRANT ${m[1].toUpperCase()} ON ${m[2]} TO anon (review intent)`,
        fingerprint: fingerprint(rel(file), ln, "ANON_GRANT"),
      });
    }
  }
  return findings;
}

function checkServiceRoleKeyExposure() {
  const findings = [];
  const files = listEdgeFunctions();
  const reKey = /SUPABASE_SERVICE_ROLE_KEY/g;
  const reLeak = /(Response|jsonResponse|console\.log|console\.error|console\.warn|return\s+new\s+Response)/i;

  for (const file of files) {
    const content = readSafe(file);
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (!reKey.test(lines[i])) {
        reKey.lastIndex = 0;
        continue;
      }
      reKey.lastIndex = 0;
      const window = lines.slice(i, Math.min(i + 11, lines.length)).join("\n");
      if (reLeak.test(window)) {
        // Only count if the leak indicator references the key var directly
        // OR the same window contains both the key and a sink — flag conservatively.
        const ln = i + 1;
        findings.push({
          id: "SERVICE_KEY_EXPOSURE",
          severity: "P0",
          file: rel(file),
          line: ln,
          message: `SUPABASE_SERVICE_ROLE_KEY appears within 10 lines of a Response/console sink`,
          fingerprint: fingerprint(rel(file), ln, "SERVICE_KEY_EXPOSURE"),
        });
      }
    }
  }
  return findings;
}

function checkEdgeFunctionAuthLeak() {
  const findings = [];
  const files = listEdgeFunctions();
  const re = /createClient\s*\([^)]*SERVICE_ROLE[^)]*\)/g;

  for (const file of files) {
    const content = readSafe(file);
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(content))) {
      const ln = lineNumber(content, m.index);
      findings.push({
        id: "SERVICE_ROLE_CLIENT",
        severity: "P1",
        file: rel(file),
        line: ln,
        message: `createClient() with SERVICE_ROLE — manual review of auth boundary required`,
        fingerprint: fingerprint(rel(file), ln, "SERVICE_ROLE_CLIENT"),
      });
    }
  }
  return findings;
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

function runAllChecks() {
  return [
    ...checkMissingRLS(),
    ...checkPermissivePolicies(),
    ...checkAnonGrants(),
    ...checkServiceRoleKeyExposure(),
    ...checkEdgeFunctionAuthLeak(),
  ];
}

function loadBaseline() {
  const path = join(ROOT, BASELINE_FILE);
  if (!existsSync(path)) return { fingerprints: [] };
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return { fingerprints: [] };
  }
}

function writeBaseline(findings) {
  const path = join(ROOT, BASELINE_FILE);
  const data = {
    generatedAt: new Date().toISOString(),
    count: findings.length,
    fingerprints: findings.map((f) => f.fingerprint),
    findings,
  };
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  return path;
}

function summary(findings) {
  const by = { P0: 0, P1: 0 };
  const byCheck = {};
  for (const f of findings) {
    by[f.severity] = (by[f.severity] || 0) + 1;
    byCheck[f.id] = (byCheck[f.id] || 0) + 1;
  }
  return { by, byCheck };
}

function printFindings(findings, label) {
  if (FLAG_JSON) {
    process.stdout.write(JSON.stringify({ label, findings }, null, 2) + "\n");
    return;
  }
  if (findings.length === 0) {
    console.log(color(C.green, `[ok] ${label}: 0 findings`));
    return;
  }
  console.log(color(C.bold, `\n${label}: ${findings.length} findings`));
  for (const f of findings) {
    const sev = f.severity === "P0" ? color(C.red, f.severity) : color(C.yellow, f.severity);
    console.log(
      `  ${sev} ${color(C.cyan, f.id)} ${color(C.gray, f.file + ":" + f.line)}\n    ${f.message}`
    );
  }
}

function main() {
  const findings = runAllChecks();

  if (FLAG_WRITE) {
    const path = writeBaseline(findings);
    const s = summary(findings);
    if (FLAG_JSON) {
      console.log(JSON.stringify({ wrote: rel(path), ...s, count: findings.length }, null, 2));
    } else {
      console.log(color(C.green, `[baseline] wrote ${rel(path)}`));
      console.log(`  total: ${findings.length}  P0: ${s.by.P0 || 0}  P1: ${s.by.P1 || 0}`);
      for (const [k, v] of Object.entries(s.byCheck)) console.log(`  ${k}: ${v}`);
    }
    process.exit(0);
  }

  if (FLAG_ALL) {
    printFindings(findings, "all findings");
    process.exit(0);
  }

  const baseline = loadBaseline();
  const known = new Set(baseline.fingerprints || []);
  const fresh = findings.filter((f) => !known.has(f.fingerprint));
  printFindings(fresh, "new findings (vs baseline)");
  const newP01 = fresh.filter((f) => f.severity === "P0" || f.severity === "P1");
  if (newP01.length > 0) {
    if (!FLAG_JSON) console.log(color(C.red, `\n[fail] ${newP01.length} new P0/P1 finding(s)`));
    process.exit(1);
  }
  if (!FLAG_JSON) console.log(color(C.green, "\n[ok] no new P0/P1 findings"));
  process.exit(0);
}

main();
