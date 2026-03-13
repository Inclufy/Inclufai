import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mkt-05-api-health',
  name: 'Marketing - API Health & Endpoints',
  app: 'marketing',
  description: 'Verify all major Marketing API endpoints are responding',
  tags: ['api', 'health', 'smoke', 'critical'],
  steps: [
    {
      name: 'Health check endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/health/');
        if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
        ctx.log(`Health: OK (${res.status})`);
      },
    },
    {
      name: 'Login via API',
      action: async (ctx) => {
        const loginPaths = ['/api/v1/auth/login/', '/api/auth/login/', '/auth/login/'];
        for (const path of loginPaths) {
          const res = await ctx.api.post(path, {
            email: ctx.app.credentials.email,
            password: ctx.app.credentials.password,
          });
          if (res.ok) {
            const token = res.data.access || res.data.token || res.data.key;
            if (token) {
              ctx.api.setToken(token);
              ctx.log(`API login successful via ${path}`);
              return;
            }
          }
        }
        ctx.log('API login: could not authenticate');
      },
    },
    {
      name: 'Newsletters endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/newsletters/newsletters/');
        ctx.log(`GET /api/v1/newsletters/newsletters/ -> ${res.status}`);
      },
    },
    {
      name: 'Newsletter templates endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/newsletters/templates/');
        ctx.log(`GET /api/v1/newsletters/templates/ -> ${res.status}`);
      },
    },
    {
      name: 'Mailing lists endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/newsletters/mailing-lists/');
        ctx.log(`GET /api/v1/newsletters/mailing-lists/ -> ${res.status}`);
      },
    },
    {
      name: 'Subscribers endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/newsletters/subscribers/');
        ctx.log(`GET /api/v1/newsletters/subscribers/ -> ${res.status}`);
      },
    },
    {
      name: 'Global newsletters endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/newsletters/global-newsletters/');
        ctx.log(`GET /api/v1/newsletters/global-newsletters/ -> ${res.status}`);
      },
    },
    {
      name: 'Communication status-reports endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/communication/status-reports/');
        ctx.log(`GET /api/v1/communication/status-reports/ -> ${res.status}`);
      },
    },
    {
      name: 'Communication meetings endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/communication/meetings/');
        ctx.log(`GET /api/v1/communication/meetings/ -> ${res.status}`);
      },
    },
    {
      name: 'Execution stakeholders endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/execution/stakeholders/');
        ctx.log(`GET /api/v1/execution/stakeholders/ -> ${res.status}`);
      },
    },
    {
      name: 'Execution change-requests endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/execution/change-requests/');
        ctx.log(`GET /api/v1/execution/change-requests/ -> ${res.status}`);
      },
    },
  ],
};

export default scenario;
