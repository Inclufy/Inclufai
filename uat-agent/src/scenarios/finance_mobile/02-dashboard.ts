import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'finmob-02-dashboard',
  name: 'Finance Mobile - Dashboard',
  app: 'finance_mobile',
  description: 'Verify Finance dashboard data loads for mobile view',
  tags: ['dashboard', 'smoke', 'critical'],
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
      name: 'API - Dashboard summary',
      action: async (ctx) => {
        const endpoints = [
          '/api/v1/admin/dashboard/',
          '/api/v1/dashboard/',
        ];
        for (const ep of endpoints) {
          const res = await ctx.api.get(ep);
          ctx.log(`GET ${ep} -> ${res.status}`);
          if (res.ok) {
            ctx.log(`Dashboard data keys: ${Object.keys(res.data).join(', ')}`);
            break;
          }
        }
      },
    },
    {
      name: 'API - Accounts overview',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/accounts/');
        ctx.log(`GET /api/v1/accounts/ -> ${res.status}`);
      },
    },
  ],
};

export default scenario;
