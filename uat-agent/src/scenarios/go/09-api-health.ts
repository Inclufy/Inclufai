import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'go-09-api-health',
  name: 'Inclufy GO - API Health & Marketing Endpoints',
  app: 'go',
  description: 'Verify all Inclufy GO / Marketing API endpoints are responding',
  tags: ['api', 'health', 'smoke', 'critical'],
  steps: [
    {
      name: 'Health check',
      action: async (ctx) => {
        const res = await ctx.api.get('/health/');
        if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
        ctx.log(`Health: OK (${res.status})`);
      },
    },
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
      name: 'Newsletters endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/newsletters/newsletters/');
        ctx.log(`GET /api/v1/newsletters/newsletters/ -> ${res.status}`);
      },
    },
    {
      name: 'Newsletter templates',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/newsletters/templates/');
        ctx.log(`GET /api/v1/newsletters/templates/ -> ${res.status}`);
      },
    },
    {
      name: 'Mailing lists',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/newsletters/mailing-lists/');
        ctx.log(`GET /api/v1/newsletters/mailing-lists/ -> ${res.status}`);
      },
    },
    {
      name: 'Subscribers',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/newsletters/subscribers/');
        ctx.log(`GET /api/v1/newsletters/subscribers/ -> ${res.status}`);
      },
    },
    {
      name: 'Global newsletters',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/newsletters/global-newsletters/');
        ctx.log(`GET /api/v1/newsletters/global-newsletters/ -> ${res.status}`);
      },
    },
    {
      name: 'Communication status-reports',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/communication/status-reports/');
        ctx.log(`GET /api/v1/communication/status-reports/ -> ${res.status}`);
      },
    },
    {
      name: 'Communication meetings',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/communication/meetings/');
        ctx.log(`GET /api/v1/communication/meetings/ -> ${res.status}`);
      },
    },
    {
      name: 'Workflow diagrams',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/workflow/diagrams/');
        ctx.log(`GET /api/v1/workflow/diagrams/ -> ${res.status}`);
      },
    },
    {
      name: 'Bot/AI chat',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/bot/chats/');
        ctx.log(`GET /api/v1/bot/chats/ -> ${res.status}`);
      },
    },
    {
      name: 'Execution stakeholders',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/execution/stakeholders/');
        ctx.log(`GET /api/v1/execution/stakeholders/ -> ${res.status}`);
      },
    },
  ],
};

export default scenario;
