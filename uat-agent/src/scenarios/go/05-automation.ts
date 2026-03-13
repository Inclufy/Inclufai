import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'go-05-automation',
  name: 'Inclufy GO - Marketing Automation',
  app: 'go',
  description: 'Test Workflows, Customer Journey (Klantreis), Multi-Agent Systems, Smart Triggers, and Campaign Triggers',
  tags: ['automation', 'workflows', 'ai', 'core'],
  steps: [
    {
      name: 'Login',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/login`);
        await ctx.page.fill('input[type="email"], input[name="email"]', ctx.app.credentials.email);
        await ctx.page.fill('input[type="password"]', ctx.app.credentials.password);
        await ctx.page.click('button[type="submit"], button:has-text("Inloggen"), button:has-text("Login")');
        await ctx.page.waitForURL(/dashboard|home/, { timeout: 15000 });

        const token = await ctx.page.evaluate(() => {
          return localStorage.getItem('token') || localStorage.getItem('access_token') || '';
        });
        if (token) {
          ctx.api.setToken(token);
          ctx.data.authToken = token;
        }
      },
    },
    {
      name: 'Navigate to Automatisering (Automation)',
      action: async (ctx) => {
        const autoNav = ctx.page.locator('text=/Automatisering|Automation/i').first();
        if ((await autoNav.count()) > 0) {
          await autoNav.click();
          await ctx.page.waitForLoadState('networkidle');
          ctx.log('Navigated to Automation via sidebar');
        } else {
          const routes = ['/automation', '/automatisering', '/marketing/automation'];
          for (const route of routes) {
            await ctx.page.goto(`${ctx.app.baseUrl}${route}`);
            await ctx.page.waitForLoadState('networkidle');
            const body = (await ctx.page.textContent('body') || '').toLowerCase();
            if (body.length > 100 && !body.includes('404')) {
              ctx.log(`Automation loaded at ${route}`);
              return;
            }
          }
          ctx.log('Automation page not found via direct routes');
        }
      },
    },
    {
      name: 'Check Workflows sub-section',
      action: async (ctx) => {
        const workflows = ctx.page.locator('text=/Workflows/i');
        if ((await workflows.count()) > 0) {
          await workflows.first().click();
          await ctx.page.waitForTimeout(1000);
          ctx.log('Workflows section opened');

          const workflowItems = await ctx.page.locator(
            '[class*="workflow"], [class*="card"], [class*="list-item"]'
          ).count();
          ctx.log(`Workflow items found: ${workflowItems}`);
        } else {
          ctx.log('Workflows section not found');
        }
      },
    },
    {
      name: 'Check Klantreis (Customer Journey)',
      action: async (ctx) => {
        const klantreis = ctx.page.locator('text=/Klantreis|Customer Journey/i');
        if ((await klantreis.count()) > 0) {
          await klantreis.first().click();
          await ctx.page.waitForTimeout(1000);
          ctx.log('Customer Journey section opened');

          const journeyElements = await ctx.page.locator(
            '[class*="journey"], [class*="flow"], [class*="step"], canvas, svg'
          ).count();
          ctx.log(`Journey visualization elements: ${journeyElements}`);
        } else {
          ctx.log('Customer Journey section not found');
        }
      },
    },
    {
      name: 'Check Multi-Agent Systems',
      action: async (ctx) => {
        const multiAgent = ctx.page.locator('text=/Multi-Agent|Multi Agent/i');
        if ((await multiAgent.count()) > 0) {
          await multiAgent.first().click();
          await ctx.page.waitForTimeout(1000);
          ctx.log('Multi-Agent Systems section opened');

          const agentItems = await ctx.page.locator(
            '[class*="agent"], [class*="card"], [class*="list-item"]'
          ).count();
          ctx.log(`Agent items found: ${agentItems}`);
        } else {
          ctx.log('Multi-Agent Systems section not found');
        }
      },
    },
    {
      name: 'Check Slimme Triggers (Smart Triggers)',
      action: async (ctx) => {
        const triggers = ctx.page.locator('text=/Slimme Trigger|Smart Trigger/i');
        if ((await triggers.count()) > 0) {
          await triggers.first().click();
          await ctx.page.waitForTimeout(1000);
          ctx.log('Smart Triggers section opened');

          const triggerItems = await ctx.page.locator(
            '[class*="trigger"], [class*="card"], [class*="list-item"]'
          ).count();
          ctx.log(`Trigger items found: ${triggerItems}`);
        } else {
          ctx.log('Smart Triggers section not found');
        }
      },
    },
    {
      name: 'Check Campaign Triggers',
      action: async (ctx) => {
        const campTriggers = ctx.page.locator('text=/Campaign Trigger/i');
        if ((await campTriggers.count()) > 0) {
          await campTriggers.first().click();
          await ctx.page.waitForTimeout(1000);
          ctx.log('Campaign Triggers section opened');
        } else {
          ctx.log('Campaign Triggers section not found');
        }
      },
    },
    {
      name: 'API - Workflow endpoints',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const endpoints = [
          '/api/v1/workflow/diagrams/',
          '/api/v1/workflow/nodes/',
          '/api/v1/workflow/edges/',
        ];
        for (const ep of endpoints) {
          const res = await ctx.api.get(ep);
          ctx.log(`GET ${ep} -> ${res.status}`);
        }
      },
    },
  ],
};

export default scenario;
