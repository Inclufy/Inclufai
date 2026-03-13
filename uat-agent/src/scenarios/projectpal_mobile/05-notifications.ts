import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'ppmob-05-notifications',
  name: 'ProjeXtPal Mobile - Notifications & Academy',
  app: 'projectpal_mobile',
  description: 'Test notifications, academy courses, and programs from mobile',
  tags: ['notifications', 'academy', 'core'],
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
              ctx.log(`Login successful via ${path}`);
              return;
            }
          }
        }
        ctx.log('Login: could not authenticate');
      },
    },
    {
      name: 'API - List notifications',
      action: async (ctx) => {
        const endpoints = ['/api/v1/notifications/', '/api/v1/users/notifications/'];
        for (const ep of endpoints) {
          const res = await ctx.api.get(ep);
          if (res.ok) {
            const items = Array.isArray(res.data) ? res.data : res.data.results || [];
            ctx.log(`Notifications (${ep}): ${items.length}`);
            break;
          }
          ctx.log(`GET ${ep} -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Academy courses',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/academy/courses/');
        if (res.ok) {
          const courses = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.log(`Academy courses: ${courses.length}`);
        } else {
          ctx.log(`Academy courses -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Programs',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/programs/');
        if (res.ok) {
          const programs = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.log(`Programs: ${programs.length}`);
        } else {
          ctx.log(`Programs -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Governance portfolios',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/governance/portfolios/');
        ctx.log(`GET /api/v1/governance/portfolios/ -> ${res.status}`);
      },
    },
    {
      name: 'API - Surveys',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/surveys/');
        ctx.log(`GET /api/v1/surveys/ -> ${res.status}`);
      },
    },
    {
      name: 'API - Subscriptions',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/subscriptions/');
        ctx.log(`GET /api/v1/subscriptions/ -> ${res.status}`);
      },
    },
  ],
};

export default scenario;
