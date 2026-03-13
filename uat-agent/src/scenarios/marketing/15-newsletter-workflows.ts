import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mkt-15-newsletter-workflows',
  name: 'Marketing - Newsletter Advanced Workflows',
  app: 'marketing',
  description: 'Test newsletter preview, sending, recipient management, mailing list sync, subscriber lifecycle, and meeting recurrence',
  tags: ['newsletters', 'workflows', 'subscribers', 'critical'],
  steps: [
    {
      name: 'Login via API',
      action: async (ctx) => {
        const loginPaths = ['/api/v1/auth/login/', '/api/auth/login/'];
        for (const path of loginPaths) {
          const res = await ctx.api.post(path, {
            email: ctx.app.credentials.email,
            password: ctx.app.credentials.password,
          });
          if (res.ok) {
            const token = res.data.access || res.data.token || res.data.key;
            if (token) {
              ctx.api.setToken(token);
              ctx.data.authToken = token;
              ctx.log(`API login successful via ${path}`);
              return;
            }
          }
        }
        ctx.log('API login: could not authenticate');
      },
    },
    {
      name: 'API - Newsletter preview',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.post('/api/v1/newsletters/newsletters/preview/', {
          subject: 'UAT Preview Test',
          content: '<h1>Test Newsletter</h1><p>This is a test preview.</p>',
        });
        ctx.log(`POST /api/v1/newsletters/newsletters/preview/ -> ${res.status}`);
        if (res.ok) {
          ctx.log(`Preview response keys: ${Object.keys(res.data).join(', ')}`);
        }
      },
    },
    {
      name: 'API - Newsletter recipients lookup',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/newsletters/newsletters/recipients/');
        ctx.log(`GET /api/v1/newsletters/newsletters/recipients/ -> ${res.status}`);
        if (res.ok) {
          ctx.log(`Recipients response: ${JSON.stringify(res.data).substring(0, 150)}`);
        }
      },
    },
    {
      name: 'API - Create newsletter and send',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        // Create a newsletter
        const createRes = await ctx.api.post('/api/v1/newsletters/newsletters/', {
          subject: 'UAT Test Newsletter',
          content: '<h1>Test</h1><p>Created by UAT agent</p>',
          recipient_type: 'custom',
        });
        if (createRes.ok) {
          ctx.data.newsletterId = createRes.data.id;
          ctx.log(`Newsletter created: ${createRes.data.id}`);

          // Send the newsletter
          const sendRes = await ctx.api.post(`/api/v1/newsletters/newsletters/${createRes.data.id}/send/`);
          ctx.log(`Newsletter send -> ${sendRes.status}`);
        } else {
          ctx.log(`Create newsletter returned ${createRes.status}`);
        }
      },
    },
    {
      name: 'API - Mailing list member sync',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        // Get mailing lists
        const listsRes = await ctx.api.get('/api/v1/newsletters/mailing-lists/');
        if (listsRes.ok) {
          const lists = Array.isArray(listsRes.data) ? listsRes.data : listsRes.data.results || [];
          ctx.log(`Mailing lists found: ${lists.length}`);

          if (lists.length > 0) {
            const listId = lists[0].id;

            // Get members
            const membersRes = await ctx.api.get(`/api/v1/newsletters/mailing-lists/${listId}/members/`);
            ctx.log(`GET mailing list ${listId} members -> ${membersRes.status}`);

            // Sync project members
            const syncRes = await ctx.api.post(`/api/v1/newsletters/mailing-lists/${listId}/sync-project-members/`);
            ctx.log(`Sync project members -> ${syncRes.status}`);
          }
        }
      },
    },
    {
      name: 'API - External subscriber subscribe/unsubscribe',
      action: async (ctx) => {
        // Subscribe (public endpoint - no auth needed)
        const subRes = await ctx.api.post('/api/v1/newsletters/subscribers/subscribe/', {
          email: 'uat-test-subscriber@example.com',
          name: 'UAT Test Subscriber',
        });
        ctx.log(`Subscribe -> ${subRes.status}`);

        // Unsubscribe (public endpoint)
        const unsubRes = await ctx.api.post('/api/v1/newsletters/subscribers/unsubscribe/', {
          email: 'uat-test-subscriber@example.com',
        });
        ctx.log(`Unsubscribe -> ${unsubRes.status}`);
      },
    },
    {
      name: 'API - Global newsletter multi-project targeting',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        // Get available projects for targeting
        const projRes = await ctx.api.get('/api/v1/newsletters/global-newsletters/projects/');
        ctx.log(`Global newsletter projects -> ${projRes.status}`);

        // List global newsletters
        const listRes = await ctx.api.get('/api/v1/newsletters/global-newsletters/');
        ctx.log(`Global newsletters list -> ${listRes.status}`);
        if (listRes.ok) {
          const items = Array.isArray(listRes.data) ? listRes.data : listRes.data.results || [];
          ctx.log(`Global newsletters: ${items.length}`);
        }
      },
    },
    {
      name: 'API - Communication training materials',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/communication/training-materials/');
        ctx.log(`GET /api/v1/communication/training-materials/ -> ${res.status}`);
      },
    },
    {
      name: 'API - Communication reporting items',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/communication/reporting-items/');
        ctx.log(`GET /api/v1/communication/reporting-items/ -> ${res.status}`);
      },
    },
    {
      name: 'API - Meeting recurrence expansion',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        // Get meetings with recurrence expansion
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const res = await ctx.api.get(`/api/v1/communication/meetings/?expand=true&month=${month}`);
        ctx.log(`GET meetings with expansion for ${month} -> ${res.status}`);
        if (res.ok) {
          const items = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.log(`Expanded meetings: ${items.length}`);
        }
      },
    },
    {
      name: 'API - Execution change request review',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        // List change requests
        const listRes = await ctx.api.get('/api/v1/execution/change-requests/');
        ctx.log(`GET /api/v1/execution/change-requests/ -> ${listRes.status}`);
        if (listRes.ok) {
          const items = Array.isArray(listRes.data) ? listRes.data : listRes.data.results || [];
          if (items.length > 0) {
            // Test review endpoint
            const reviewRes = await ctx.api.post(`/api/v1/execution/change-requests/${items[0].id}/review/`, {
              status: 'under_review',
              comment: 'UAT agent review test',
            });
            ctx.log(`Change request review -> ${reviewRes.status}`);
          }
        }
      },
    },
    {
      name: 'API - Execution governance',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/execution/governance/');
        ctx.log(`GET /api/v1/execution/governance/ -> ${res.status}`);
      },
    },
    {
      name: 'Cleanup test newsletter',
      action: async (ctx) => {
        if (ctx.data.newsletterId) {
          await ctx.api.delete(`/api/v1/newsletters/newsletters/${ctx.data.newsletterId}/`);
          ctx.log('Cleaned up test newsletter');
        }
      },
    },
  ],
};

export default scenario;
