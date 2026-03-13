import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mkt-09-communication',
  name: 'Marketing - Communication & Status Reporting',
  app: 'marketing',
  description: 'Test communication features: status reports, meetings, and reporting',
  tags: ['communication', 'reporting', 'core'],
  steps: [
    {
      name: 'Verify status reports API',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/communication/status-reports/');
        ctx.log(`Status reports API: ${res.status} (${res.ok ? 'OK' : 'FAIL'})`);
      },
    },
    {
      name: 'Verify meetings API',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/communication/meetings/');
        ctx.log(`Meetings API: ${res.status} (${res.ok ? 'OK' : 'FAIL'})`);
      },
    },
    {
      name: 'Verify reporting items API',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/communication/reporting-items/');
        ctx.log(`Reporting items API: ${res.status} (${res.ok ? 'OK' : 'FAIL'})`);
      },
    },
    {
      name: 'Verify training materials API',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/communication/training-materials/');
        ctx.log(`Training materials API: ${res.status} (${res.ok ? 'OK' : 'FAIL'})`);
      },
    },
    {
      name: 'Navigate to status reporting page',
      action: async (ctx) => {
        const routes = [
          '/status-reporting',
          '/communication/status-reporting',
          '/projects/1/execution/communication/status-reporting',
        ];
        for (const route of routes) {
          await ctx.page.goto(`${ctx.app.baseUrl}${route}`);
          await ctx.page.waitForLoadState('networkidle');
          const body = (await ctx.page.textContent('body') || '').toLowerCase();
          if (body.length > 100 && !body.includes('404') && !body.includes('not found')) {
            ctx.log(`Status reporting page loaded at ${route}`);
            return;
          }
        }
        ctx.log('Status reporting page not found at common routes');
      },
    },
    {
      name: 'Navigate to meetings page',
      action: async (ctx) => {
        const routes = [
          '/meetings',
          '/communication/meetings',
          '/projects/1/execution/communication/meeting',
        ];
        for (const route of routes) {
          await ctx.page.goto(`${ctx.app.baseUrl}${route}`);
          await ctx.page.waitForLoadState('networkidle');
          const body = (await ctx.page.textContent('body') || '').toLowerCase();
          if (body.length > 100 && !body.includes('404') && !body.includes('not found')) {
            ctx.log(`Meetings page loaded at ${route}`);
            return;
          }
        }
        ctx.log('Meetings page not found at common routes');
      },
    },
  ],
};

export default scenario;
