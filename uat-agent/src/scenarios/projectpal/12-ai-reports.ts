import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'pp-12-ai-reports',
  name: 'ProjeXtPal - AI-Powered Reports',
  app: 'projectpal',
  description: 'Test AI report generation including executive, project, and operational reports',
  tags: ['reports', 'ai', 'core'],
  steps: [
    {
      name: 'Login and authenticate',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/login`);
        await ctx.page.fill('input[type="email"]', ctx.app.credentials.email);
        await ctx.page.fill('input[type="password"]', ctx.app.credentials.password);
        await ctx.page.click('button[type="submit"]');
        await ctx.page.waitForURL(/dashboard|projects/, { timeout: 15000 });

        const token = await ctx.page.evaluate(() => {
          return localStorage.getItem('token') || localStorage.getItem('access_token') || '';
        });
        if (token) {
          ctx.api.setToken(token);
          ctx.data.authToken = token;
        }
        ctx.log('Logged in successfully');
      },
    },
    {
      name: 'Navigate to reports page',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/reports`);
        await ctx.page.waitForLoadState('networkidle');
        const heading = await ctx.page.locator('h1, h2, [class*="title"]').first().textContent();
        ctx.log(`Reports page loaded: ${heading}`);
      },
    },
    {
      name: 'Check report templates are displayed',
      action: async (ctx) => {
        const templateCards = await ctx.page.locator('[class*="card"], [class*="template"], [role="button"]').count();
        ctx.log(`Report template elements found: ${templateCards}`);

        // Check for report categories
        const categories = ['executive', 'project', 'operational'];
        for (const cat of categories) {
          const found = await ctx.page.locator(`text=/${cat}/i`).count();
          ctx.log(`Category '${cat}' elements: ${found}`);
        }
      },
    },
    {
      name: 'Check report generation modal',
      action: async (ctx) => {
        // Try to click on a report template to open modal
        const reportBtn = ctx.page.locator('[class*="card"], [class*="template"]').first();
        if ((await reportBtn.count()) > 0) {
          await reportBtn.click();
          await ctx.page.waitForTimeout(1000);

          const modal = await ctx.page.locator('[role="dialog"], [class*="modal"], [class*="Modal"]').count();
          ctx.log(`Report modal/dialog found: ${modal > 0}`);

          // Check for generate button within modal
          const generateBtn = ctx.page.locator('button').filter({ hasText: /generate|create|run/i });
          const genCount = await generateBtn.count();
          ctx.log(`Generate report buttons found: ${genCount}`);

          // Close modal if open
          const closeBtn = ctx.page.locator('button[aria-label*="close" i], button[class*="close" i]');
          if ((await closeBtn.count()) > 0) {
            await closeBtn.first().click();
          }
        } else {
          ctx.log('No report template cards found to click');
          ctx.reportIssue({
            type: 'missing_feature',
            severity: 'major',
            title: 'No report templates displayed',
            description: 'Expected report template cards on the reports page',
          });
        }
      },
    },
    {
      name: 'API - Generate executive report',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping API test');
          return;
        }
        const res = await ctx.api.post('/api/v1/governance/reports/generate/', {
          type: 'executive_summary',
        });
        if (res.ok) {
          const hasContent = !!res.data.content || !!res.data.report || !!res.data.html;
          ctx.log(`Executive report generated: hasContent=${hasContent}`);
          if (res.data.content) {
            ctx.log(`Report preview: "${String(res.data.content).substring(0, 100)}..."`);
          }
        } else {
          ctx.log(`Executive report generation returned ${res.status}`);
        }
      },
    },
    {
      name: 'API - Generate portfolio analysis report',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping API test');
          return;
        }
        const res = await ctx.api.post('/api/v1/governance/reports/generate/', {
          type: 'portfolio_analysis',
        });
        ctx.log(`Portfolio analysis report -> ${res.status} (ok: ${res.ok})`);
      },
    },
    {
      name: 'API - AI text generation endpoint',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping API test');
          return;
        }
        const res = await ctx.api.post('/api/v1/governance/ai/generate/', {
          prompt: 'Summarize project health metrics for a quarterly review',
          type: 'report',
        });
        if (res.ok) {
          ctx.log(`AI text generation successful`);
        } else {
          ctx.log(`AI text generation returned ${res.status}`);
        }
      },
    },
  ],
};

export default scenario;
