# Data-leak audit

A lightweight, dependency-free auditor for Supabase-based projects that catches
the most common data-leak patterns in migrations and edge functions.

## What it checks

| ID                    | Severity | What                                                                                       |
| --------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `MISSING_RLS`         | P0       | `CREATE TABLE public.<x>` without a matching `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`. |
| `PERMISSIVE_POLICY`   | P0       | `USING (true)` or `USING (auth.role() = 'authenticated')` on a policy not later dropped.   |
| `ANON_GRANT`          | P1       | `GRANT EXECUTE/SELECT/INSERT/UPDATE/DELETE ... TO anon` (often intentional — review).      |
| `SERVICE_KEY_EXPOSURE`| P0       | `SUPABASE_SERVICE_ROLE_KEY` within 10 lines of a `Response`/`console.log` sink.            |
| `SERVICE_ROLE_CLIENT` | P1       | `createClient(..., SERVICE_ROLE)` in an edge function — needs auth-boundary review.        |

## Run it

```sh
node scripts/audit-data-leaks.mjs                 # diff vs baseline (CI mode)
node scripts/audit-data-leaks.mjs --all           # print every finding
node scripts/audit-data-leaks.mjs --json          # machine-readable output
node scripts/audit-data-leaks.mjs --write-baseline # snapshot current findings
```

Exit codes: `0` clean (or baseline written), `1` if new P0/P1 findings appeared
since the baseline.

## Baseline workflow

1. Run `--write-baseline` once to record the current state into
   `.data-leak-baseline.json`. Commit that file.
2. CI then runs the auditor in default mode on every push/MR. New P0/P1 findings
   fail the pipeline.
3. After fixing (or accepting) findings, regenerate the baseline:
   ```sh
   node scripts/audit-data-leaks.mjs --write-baseline
   git commit -m "chore(security): refresh data-leak baseline" .data-leak-baseline.json
   ```

## Configuring the TABLES list

Open `scripts/audit-data-leaks.mjs` and edit:

```js
const TABLES = [
  "profiles",
  "invoices",
  "transactions",
];
```

- **Empty list** → check every table found in migrations.
- **Populated** → only enforce `MISSING_RLS` for tables in the list.
  Use this to allow-list intentionally public tables (e.g. `course_catalog`,
  `pricing_tiers`) by simply NOT including them.

Keep the list to roughly the top-10 most-referenced sensitive tables in
`supabase/migrations/`.

## CI: GitHub Actions

```yaml
data-leak-audit:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
    - run: node scripts/audit-data-leaks.mjs
```

## CI: GitLab CI

```yaml
data-leak-audit:
  stage: test
  image: node:20
  script:
    - node scripts/audit-data-leaks.mjs
  rules:
    - if: $CI_PIPELINE_SOURCE == "push"
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

## Installing into another repo

From the inclufy-finance repo:

```sh
bash scripts/install-data-leak-audit.sh /path/to/target-repo
```

This copies the auditor, this doc, and the Claude agent definition into the
target, and ensures `node_modules/` is in `.gitignore`. No npm install needed.
