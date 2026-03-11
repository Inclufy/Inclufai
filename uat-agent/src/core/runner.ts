import { chromium, type Browser, type Page } from 'playwright';
import { createApiClient } from './api-client.js';
import type {
  Scenario,
  ScenarioContext,
  ScenarioResult,
  StepResult,
  TestReport,
  AppConfig,
  AgentConfig,
} from './types.js';

export class TestRunner {
  private browser: Browser | null = null;
  private scenarios: Scenario[] = [];
  private appConfig: AppConfig;
  private agentConfig: AgentConfig;
  private onStepLog: (scenarioId: string, message: string) => void;

  constructor(
    appConfig: AppConfig,
    agentConfig: AgentConfig,
    onStepLog?: (scenarioId: string, message: string) => void
  ) {
    this.appConfig = appConfig;
    this.agentConfig = agentConfig;
    this.onStepLog = onStepLog || (() => {});
  }

  addScenario(scenario: Scenario): void {
    this.scenarios.push(scenario);
  }

  addScenarios(scenarios: Scenario[]): void {
    this.scenarios.push(...scenarios);
  }

  async run(filter?: { ids?: string[]; tags?: string[] }): Promise<TestReport> {
    const startedAt = new Date().toISOString();
    const startTime = Date.now();

    this.browser = await chromium.launch({
      headless: this.agentConfig.headless,
    });

    let scenariosToRun = this.scenarios;
    if (filter?.ids?.length) {
      scenariosToRun = scenariosToRun.filter((s) => filter.ids!.includes(s.id));
    }
    if (filter?.tags?.length) {
      scenariosToRun = scenariosToRun.filter((s) =>
        s.tags.some((t) => filter.tags!.includes(t))
      );
    }

    const results: ScenarioResult[] = [];

    for (const scenario of scenariosToRun) {
      const result = await this.runScenario(scenario);
      results.push(result);
    }

    await this.browser.close();
    this.browser = null;

    const finishedAt = new Date().toISOString();
    const duration = Date.now() - startTime;

    return {
      agent: 'inclufy-uat-agent',
      version: '1.0.0',
      app: this.appConfig.name,
      environment: this.appConfig.baseUrl,
      startedAt,
      finishedAt,
      duration,
      summary: {
        total: results.length,
        passed: results.filter((r) => r.status === 'passed').length,
        failed: results.filter((r) => r.status === 'failed').length,
        skipped: results.filter((r) => r.status === 'skipped').length,
      },
      scenarios: results,
    };
  }

  private async runScenario(scenario: Scenario): Promise<ScenarioResult> {
    const startedAt = new Date().toISOString();
    const startTime = Date.now();
    const steps: StepResult[] = [];
    let scenarioStatus: 'passed' | 'failed' | 'skipped' = 'passed';

    const context = await this.browser!.newContext({
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
    });
    const page = await context.newPage();
    page.setDefaultTimeout(this.agentConfig.timeoutMs);

    const api = createApiClient(this.appConfig.apiUrl);

    const ctx: ScenarioContext = {
      page,
      api,
      app: this.appConfig,
      config: this.agentConfig,
      data: {},
      log: (message: string) => {
        this.onStepLog(scenario.id, message);
      },
    };

    for (const step of scenario.steps) {
      const stepStart = Date.now();
      let retries = 0;
      let stepPassed = false;

      while (retries <= this.agentConfig.retryCount && !stepPassed) {
        try {
          ctx.log(`  → ${step.name}${retries > 0 ? ` (retry ${retries})` : ''}`);
          await step.action(ctx);
          steps.push({
            name: step.name,
            status: 'passed',
            duration: Date.now() - stepStart,
          });
          stepPassed = true;
        } catch (error: any) {
          retries++;
          if (retries > this.agentConfig.retryCount) {
            let screenshotPath: string | undefined;
            if (this.agentConfig.screenshotOnFailure) {
              try {
                screenshotPath = `${this.agentConfig.reportOutput}/screenshots/${scenario.id}-${step.name.replace(/\s+/g, '-')}.png`;
                await page.screenshot({ path: screenshotPath, fullPage: true });
              } catch {
                // Screenshot failed, continue
              }
            }
            steps.push({
              name: step.name,
              status: 'failed',
              duration: Date.now() - stepStart,
              error: error.message,
              screenshot: screenshotPath,
            });
            scenarioStatus = 'failed';

            // Skip remaining steps
            for (
              let i = scenario.steps.indexOf(step) + 1;
              i < scenario.steps.length;
              i++
            ) {
              steps.push({
                name: scenario.steps[i].name,
                status: 'skipped',
                duration: 0,
              });
            }
            break;
          }
        }
      }

      if (scenarioStatus === 'failed') break;
    }

    await context.close();

    return {
      id: scenario.id,
      name: scenario.name,
      app: scenario.app,
      status: scenarioStatus,
      steps,
      duration: Date.now() - startTime,
      startedAt,
      finishedAt: new Date().toISOString(),
    };
  }
}
