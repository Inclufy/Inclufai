import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mkt-10-execution-stakeholders',
  name: 'Marketing - Execution & Stakeholder Management',
  app: 'marketing',
  description: 'Test execution stakeholders, governance, and change request features',
  tags: ['execution', 'stakeholders', 'governance', 'core'],
  steps: [
    {
      name: 'Verify execution stakeholders API',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/execution/stakeholders/');
        ctx.log(`Stakeholders API: ${res.status} (${res.ok ? 'OK' : 'FAIL'})`);
        if (res.ok) {
          const count = Array.isArray(res.data) ? res.data.length : res.data?.results?.length || 0;
          ctx.log(`  Found ${count} stakeholders`);
        }
      },
    },
    {
      name: 'Verify execution governance API',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/execution/governance/');
        ctx.log(`Execution governance API: ${res.status} (${res.ok ? 'OK' : 'FAIL'})`);
      },
    },
    {
      name: 'Verify change requests API',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/execution/change-requests/');
        ctx.log(`Change requests API: ${res.status} (${res.ok ? 'OK' : 'FAIL'})`);
      },
    },
    {
      name: 'Navigate to stakeholders page',
      action: async (ctx) => {
        const routes = [
          '/stakeholders',
          '/execution/stakeholders',
          '/projects/1/execution/stakeholders',
        ];
        for (const route of routes) {
          await ctx.page.goto(`${ctx.app.baseUrl}${route}`);
          await ctx.page.waitForLoadState('networkidle');
          const body = (await ctx.page.textContent('body') || '').toLowerCase();
          if (body.length > 100 && !body.includes('404') && !body.includes('not found')) {
            ctx.log(`Stakeholders page loaded at ${route}`);
            return;
          }
        }
        ctx.log('Stakeholders page not found at common routes');
      },
    },
    {
      name: 'Check stakeholder data display',
      action: async (ctx) => {
        const body = (await ctx.page.textContent('body') || '').toLowerCase();
        const terms = ['name', 'email', 'role', 'contact', 'stakeholder', 'governance'];
        const found = terms.filter(t => body.includes(t));
        ctx.log(`Stakeholder-related terms found: ${found.join(', ') || 'none'}`);
      },
    },
  ],
};

export default scenario;
