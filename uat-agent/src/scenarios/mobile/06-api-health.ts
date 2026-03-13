import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mob-06-api-health',
  name: 'Mobile - API Health & Endpoints',
  app: 'mobile',
  description: 'Verify all API endpoints required by the mobile app are responding',
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
      name: 'API schema endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/schema/');
        ctx.log(`API schema: ${res.status} (${res.ok ? 'OK' : 'FAIL'})`);
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
              ctx.log(`API login successful via ${path}`);
              return;
            }
          }
        }
        ctx.log('API login: could not authenticate');
      },
    },
    {
      name: 'User profile endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/users/me/');
        ctx.log(`GET /api/v1/users/me/ -> ${res.status}`);
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
      name: 'Programs endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/programs/');
        ctx.log(`GET /api/v1/programs/ -> ${res.status}`);
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
      name: 'Academy courses endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/academy/courses/');
        ctx.log(`GET /api/v1/academy/courses/ -> ${res.status}`);
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
