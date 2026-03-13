import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mkt-11-global-newsletters',
  name: 'Marketing - Global Newsletters & CRM Integration',
  app: 'marketing',
  description: 'Test global newsletter sending, CRM user targeting, and cross-project newsletter features',
  tags: ['newsletters', 'crm', 'global', 'advanced'],
  steps: [
    {
      name: 'Verify global newsletters API',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/newsletters/global-newsletters/');
        ctx.log(`Global newsletters API: ${res.status} (${res.ok ? 'OK' : 'FAIL'})`);
        if (res.ok) {
          const count = Array.isArray(res.data) ? res.data.length : res.data?.results?.length || 0;
          ctx.log(`  Found ${count} global newsletters`);
        }
      },
    },
    {
      name: 'Verify newsletter CRUD via API',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/newsletters/newsletters/');
        if (res.ok) {
          const count = Array.isArray(res.data) ? res.data.length : res.data?.results?.length || 0;
          ctx.log(`Newsletters API: OK (${count} newsletters found)`);

          // Check data structure of first newsletter
          const newsletters = Array.isArray(res.data) ? res.data : res.data?.results || [];
          if (newsletters.length > 0) {
            const nl = newsletters[0];
            const fields = ['id', 'subject', 'status', 'recipient_type', 'created_at'];
            const found = fields.filter(f => f in nl);
            ctx.log(`Newsletter fields present: ${found.join(', ')}`);
          }
        } else {
          ctx.log(`Newsletters API: ${res.status}`);
        }
      },
    },
    {
      name: 'Check newsletter recipient types',
      action: async (ctx) => {
        const body = (await ctx.page.textContent('body') || '').toLowerCase();
        const recipientTypes = ['project team', 'stakeholder', 'steering committee', 'custom', 'mailing list', 'crm'];
        const found = recipientTypes.filter(t => body.includes(t));
        ctx.log(`Recipient types found in UI: ${found.join(', ') || 'none visible'}`);
      },
    },
    {
      name: 'Check newsletter status workflow',
      action: async (ctx) => {
        const body = (await ctx.page.textContent('body') || '').toLowerCase();
        const statuses = ['draft', 'sent', 'failed'];
        const found = statuses.filter(s => body.includes(s));
        ctx.log(`Newsletter statuses found: ${found.join(', ') || 'none visible'}`);
      },
    },
  ],
};

export default scenario;
