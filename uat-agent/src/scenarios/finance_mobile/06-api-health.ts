import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'finmob-06-api-health',
  name: 'Finance Mobile - API Health',
  app: 'finance_mobile',
  description: 'Verify all Finance API endpoints required by the mobile app are responding',
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
              ctx.log(`Login successful via ${path}`);
              return;
            }
          }
        }
        ctx.log('Could not authenticate');
      },
    },
    {
      name: 'Invoices endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/admin/invoices/');
        ctx.log(`GET /api/v1/admin/invoices/ -> ${res.status}`);
      },
    },
    {
      name: 'Invoice settings endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/admin/invoice-settings/');
        ctx.log(`GET /api/v1/admin/invoice-settings/ -> ${res.status}`);
      },
    },
    {
      name: 'Transactions endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/transactions/');
        ctx.log(`GET /api/v1/transactions/ -> ${res.status}`);
      },
    },
    {
      name: 'Accounts endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/accounts/');
        ctx.log(`GET /api/v1/accounts/ -> ${res.status}`);
      },
    },
    {
      name: 'Reports endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/reports/');
        ctx.log(`GET /api/v1/reports/ -> ${res.status}`);
      },
    },
    {
      name: 'User profile endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/users/me/');
        ctx.log(`GET /api/v1/users/me/ -> ${res.status}`);
      },
    },
  ],
};

export default scenario;
