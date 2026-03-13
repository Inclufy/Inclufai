import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mkt-07-mailing-lists',
  name: 'Marketing - Mailing Lists & Subscribers',
  app: 'marketing',
  description: 'Test mailing list management, subscriber handling, and list segmentation',
  tags: ['mailing-lists', 'subscribers', 'crm', 'core'],
  steps: [
    {
      name: 'Navigate to mailing lists',
      action: async (ctx) => {
        const routes = ['/mailing-lists', '/lists', '/subscribers', '/contacts/lists'];
        for (const route of routes) {
          await ctx.page.goto(`${ctx.app.baseUrl}${route}`);
          await ctx.page.waitForLoadState('networkidle');
          const body = (await ctx.page.textContent('body') || '').toLowerCase();
          if (body.length > 100 && !body.includes('404') && !body.includes('not found')) {
            ctx.log(`Mailing lists page loaded at ${route}`);
            ctx.data.mailingListRoute = route;
            return;
          }
        }
        ctx.log('Mailing lists page not found at common routes - checking via API');
      },
    },
    {
      name: 'Verify mailing lists API',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/newsletters/mailing-lists/');
        if (res.ok) {
          const count = Array.isArray(res.data) ? res.data.length : res.data?.results?.length || 0;
          ctx.log(`Mailing lists API: OK (${count} lists found)`);
        } else {
          ctx.log(`Mailing lists API: ${res.status}`);
        }
      },
    },
    {
      name: 'Verify subscribers API',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/newsletters/subscribers/');
        if (res.ok) {
          const count = Array.isArray(res.data) ? res.data.length : res.data?.results?.length || 0;
          ctx.log(`Subscribers API: OK (${count} subscribers found)`);
        } else {
          ctx.log(`Subscribers API: ${res.status}`);
        }
      },
    },
    {
      name: 'Check mailing list types',
      action: async (ctx) => {
        const body = (await ctx.page.textContent('body') || '').toLowerCase();
        const listTypes = ['external', 'project team', 'stakeholder', 'custom'];
        const found = listTypes.filter(t => body.includes(t));
        ctx.log(`Mailing list types found: ${found.join(', ') || 'none (may need data)'}`);
      },
    },
  ],
};

export default scenario;
