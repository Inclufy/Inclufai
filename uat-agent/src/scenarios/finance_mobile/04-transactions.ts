import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'finmob-04-transactions',
  name: 'Finance Mobile - Transactions',
  app: 'finance_mobile',
  description: 'Test transaction listing and account data from mobile',
  tags: ['transactions', 'core'],
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
      name: 'API - List transactions',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/transactions/');
        ctx.log(`GET /api/v1/transactions/ -> ${res.status}`);
        if (res.ok) {
          const items = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.log(`Transactions: ${items.length}`);
        }
      },
    },
    {
      name: 'API - Accounts list',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/accounts/');
        ctx.log(`GET /api/v1/accounts/ -> ${res.status}`);
        if (res.ok) {
          const items = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.log(`Accounts: ${items.length}`);
        }
      },
    },
    {
      name: 'API - Reports overview',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/reports/');
        ctx.log(`GET /api/v1/reports/ -> ${res.status}`);
      },
    },
  ],
};

export default scenario;
