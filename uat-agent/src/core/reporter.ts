import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import type { TestReport } from './types.js';

export function printReport(report: TestReport): void {
  const line = '─'.repeat(60);
  console.log(`\n${line}`);
  console.log(`  UAT Test Report: ${report.app}`);
  console.log(`  Environment: ${report.environment}`);
  console.log(`  Duration: ${formatDuration(report.duration)}`);
  console.log(line);

  console.log(
    `\n  Total: ${report.summary.total}  |  ` +
      `Passed: ${report.summary.passed}  |  ` +
      `Failed: ${report.summary.failed}  |  ` +
      `Skipped: ${report.summary.skipped}`
  );

  console.log(`\n${line}`);
  console.log('  Scenarios:');
  console.log(line);

  for (const scenario of report.scenarios) {
    const icon =
      scenario.status === 'passed'
        ? '[PASS]'
        : scenario.status === 'failed'
          ? '[FAIL]'
          : '[SKIP]';
    console.log(
      `\n  ${icon} ${scenario.name} (${formatDuration(scenario.duration)})`
    );

    for (const step of scenario.steps) {
      const stepIcon =
        step.status === 'passed'
          ? '  +'
          : step.status === 'failed'
            ? '  x'
            : '  -';
      const extra = step.error ? ` -- ${step.error}` : '';
      console.log(
        `      ${stepIcon} ${step.name} (${formatDuration(step.duration)})${extra}`
      );
    }
  }

  console.log(`\n${line}\n`);
}

export function saveReport(report: TestReport, outputDir: string): string {
  const dir = resolve(outputDir);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `uat-report-${report.app.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.json`;
  const filepath = resolve(dir, filename);

  writeFileSync(filepath, JSON.stringify(report, null, 2));

  // Also save an HTML report
  const htmlPath = filepath.replace('.json', '.html');
  writeFileSync(htmlPath, generateHtmlReport(report));

  console.log(`  Report saved: ${filepath}`);
  console.log(`  HTML report:  ${htmlPath}`);
  return filepath;
}

function generateHtmlReport(report: TestReport): string {
  const passRate =
    report.summary.total > 0
      ? Math.round((report.summary.passed / report.summary.total) * 100)
      : 0;

  const scenarioRows = report.scenarios
    .map((s) => {
      const statusClass =
        s.status === 'passed' ? 'pass' : s.status === 'failed' ? 'fail' : 'skip';
      const stepsHtml = s.steps
        .map((step) => {
          const cls =
            step.status === 'passed'
              ? 'pass'
              : step.status === 'failed'
                ? 'fail'
                : 'skip';
          return `<li class="${cls}">${step.name} <span class="dur">(${formatDuration(step.duration)})</span>${step.error ? `<br><small class="err">${escapeHtml(step.error)}</small>` : ''}</li>`;
        })
        .join('');
      return `
      <div class="scenario ${statusClass}">
        <h3>${escapeHtml(s.name)} <span class="badge ${statusClass}">${s.status.toUpperCase()}</span></h3>
        <p>Duration: ${formatDuration(s.duration)}</p>
        <ol class="steps">${stepsHtml}</ol>
      </div>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>UAT Report - ${escapeHtml(report.app)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; background: #1a1a2e; color: #e0e0e0; }
    h1 { color: #8be9fd; }
    h2 { color: #bd93f9; border-bottom: 1px solid #44475a; padding-bottom: 8px; }
    .summary { display: flex; gap: 20px; margin: 20px 0; }
    .stat { background: #282a36; padding: 16px 24px; border-radius: 8px; text-align: center; flex: 1; }
    .stat .num { font-size: 2em; font-weight: bold; }
    .stat.total .num { color: #8be9fd; }
    .stat.passed .num { color: #50fa7b; }
    .stat.failed .num { color: #ff5555; }
    .stat.skipped .num { color: #f1fa8c; }
    .scenario { background: #282a36; border-radius: 8px; padding: 16px; margin: 12px 0; border-left: 4px solid #44475a; }
    .scenario.pass { border-left-color: #50fa7b; }
    .scenario.fail { border-left-color: #ff5555; }
    .scenario.skip { border-left-color: #f1fa8c; }
    .badge { padding: 2px 8px; border-radius: 4px; font-size: 0.75em; }
    .badge.pass { background: #50fa7b; color: #1a1a2e; }
    .badge.fail { background: #ff5555; color: #fff; }
    .badge.skip { background: #f1fa8c; color: #1a1a2e; }
    .steps { list-style: decimal; padding-left: 24px; }
    .steps li { padding: 4px 0; }
    .steps li.pass { color: #50fa7b; }
    .steps li.fail { color: #ff5555; }
    .steps li.skip { color: #6272a4; }
    .dur { color: #6272a4; }
    .err { color: #ff79c6; }
    .meta { color: #6272a4; font-size: 0.9em; }
  </style>
</head>
<body>
  <h1>UAT Test Report</h1>
  <p class="meta">App: <strong>${escapeHtml(report.app)}</strong> | Environment: ${escapeHtml(report.environment)} | ${report.startedAt}</p>

  <div class="summary">
    <div class="stat total"><div class="num">${report.summary.total}</div><div>Total</div></div>
    <div class="stat passed"><div class="num">${report.summary.passed}</div><div>Passed</div></div>
    <div class="stat failed"><div class="num">${report.summary.failed}</div><div>Failed</div></div>
    <div class="stat skipped"><div class="num">${report.summary.skipped}</div><div>Skipped</div></div>
  </div>

  <h2>Pass Rate: ${passRate}%</h2>
  <div style="background:#44475a;border-radius:8px;height:12px;overflow:hidden;">
    <div style="background:${passRate >= 80 ? '#50fa7b' : passRate >= 50 ? '#f1fa8c' : '#ff5555'};height:100%;width:${passRate}%;transition:width 0.5s;"></div>
  </div>

  <h2>Scenarios</h2>
  ${scenarioRows}

  <p class="meta" style="margin-top:30px;">Generated by inclufy-uat-agent v${report.version} | Duration: ${formatDuration(report.duration)}</p>
</body>
</html>`;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
