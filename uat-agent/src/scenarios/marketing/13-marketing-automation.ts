import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mkt-13-automation',
  name: 'Marketing - Automation & Workflows',
  app: 'marketing',
  description: 'Test marketing automation workflows, triggers, customer journeys, and multi-agent systems',
  tags: ['automation', 'workflows', 'core'],
  steps: [
    {
      name: 'Login',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/login`);
        await ctx.page.fill('input[type="email"], input[name="email"]', ctx.app.credentials.email);
        await ctx.page.fill('input[type="password"]', ctx.app.credentials.password);
        await ctx.page.click('button[type="submit"]');
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
      name: 'Navigate to Automation page',
      action: async (ctx) => {
        const autoNav = ctx.page.locator('a, [role="menuitem"]').filter({ hasText: /Automatisering|Automation/i });
        if ((await autoNav.count()) > 0) {
          await autoNav.first().click();
          await ctx.page.waitForLoadState('networkidle');
          ctx.log('Automation page loaded via sidebar');
        } else {
          const routes = ['/automation', '/automatisering', '/workflows'];
          for (const route of routes) {
            await ctx.page.goto(`${ctx.app.baseUrl}${route}`);
            await ctx.page.waitForLoadState('networkidle');
            const body = (await ctx.page.textContent('body') || '').toLowerCase();
            if (body.length > 100 && !body.includes('404')) {
              ctx.log(`Automation loaded at ${route}`);
              return;
            }
          }
          ctx.log('Automation page not found');
        }
      },
    },
    {
      name: 'Check automation sub-sections',
      action: async (ctx) => {
        const sections = [
          { name: 'Workflows', selector: 'text=/Workflows/i' },
          { name: 'Klantreis', selector: 'text=/Klantreis|Customer Journey/i' },
          { name: 'Multi-Agent', selector: 'text=/Multi-Agent/i' },
          { name: 'Slimme Triggers', selector: 'text=/Slimme Trigger|Smart Trigger/i' },
          { name: 'Campaign Triggers', selector: 'text=/Campaign Trigger/i' },
        ];

        for (const section of sections) {
          const found = await ctx.page.locator(section.selector).count();
          ctx.log(`Section '${section.name}': ${found > 0 ? 'found' : 'not found'}`);
        }
      },
    },
    {
      name: 'API - Workflow diagrams CRUD',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }

        // List
        const listRes = await ctx.api.get('/api/v1/workflow/diagrams/');
        ctx.log(`GET /api/v1/workflow/diagrams/ -> ${listRes.status}`);

        // Create
        const createRes = await ctx.api.post('/api/v1/workflow/diagrams/', {
          name: 'UAT Test Workflow',
          description: 'Created by UAT agent',
        });
        if (createRes.ok) {
          ctx.data.workflowId = createRes.data.id;
          ctx.log(`Workflow created: ${createRes.data.id}`);
        } else {
          ctx.log(`Create workflow returned ${createRes.status}`);
        }
      },
    },
    {
      name: 'API - Workflow nodes',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/workflow/nodes/');
        ctx.log(`GET /api/v1/workflow/nodes/ -> ${res.status}`);
      },
    },
    {
      name: 'API - Workflow edges',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/workflow/edges/');
        ctx.log(`GET /api/v1/workflow/edges/ -> ${res.status}`);
      },
    },
    {
      name: 'Cleanup',
      action: async (ctx) => {
        if (ctx.data.workflowId) {
          await ctx.api.delete(`/api/v1/workflow/diagrams/${ctx.data.workflowId}/`);
          ctx.log('Cleaned up test workflow');
        }
      },
    },
  ],
};

export default scenario;
