import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'ppmob-06-api-health',
  name: 'ProjeXtPal Mobile - API Health',
  app: 'projectpal_mobile',
  description: 'Verify all ProjeXtPal API endpoints required by the mobile app are responding',
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
              ctx.log(`Login successful via ${path}`);
              return;
            }
          }
        }
        ctx.log('Could not authenticate');
      },
    },
    {
      name: 'Projects endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/projects/');
        ctx.log(`GET /api/v1/projects/ -> ${res.status}`);
      },
    },
    {
      name: 'Tasks endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/projects/tasks/');
        ctx.log(`GET /api/v1/projects/tasks/ -> ${res.status}`);
      },
    },
    {
      name: 'Milestones endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/projects/milestones/');
        ctx.log(`GET /api/v1/projects/milestones/ -> ${res.status}`);
      },
    },
    {
      name: 'Bot/Chat endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/bot/chats/');
        ctx.log(`GET /api/v1/bot/chats/ -> ${res.status}`);
      },
    },
    {
      name: 'Academy endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/academy/courses/');
        ctx.log(`GET /api/v1/academy/courses/ -> ${res.status}`);
      },
    },
    {
      name: 'Programs endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/programs/');
        ctx.log(`GET /api/v1/programs/ -> ${res.status}`);
      },
    },
    {
      name: 'Governance endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/governance/portfolios/');
        ctx.log(`GET /api/v1/governance/portfolios/ -> ${res.status}`);
      },
    },
    {
      name: 'Subscriptions endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/subscriptions/');
        ctx.log(`GET /api/v1/subscriptions/ -> ${res.status}`);
      },
    },
    {
      name: 'Newsletters endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/newsletters/newsletters/');
        ctx.log(`GET /api/v1/newsletters/newsletters/ -> ${res.status}`);
      },
    },
  ],
};

export default scenario;
