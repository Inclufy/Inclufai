import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'finmob-03-invoices',
  name: 'Finance Mobile - Invoice Management',
  app: 'finance_mobile',
  description: 'Test invoice listing, filtering, and detail views from mobile',
  tags: ['invoices', 'core', 'critical'],
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
      name: 'API - List all invoices',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/admin/invoices/');
        ctx.log(`GET /api/v1/admin/invoices/ -> ${res.status}`);
        if (res.ok) {
          const items = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.data.invoices = items;
          ctx.log(`Invoices: ${items.length}`);
          if (items.length > 0) {
            ctx.data.invoiceId = items[0].id;
          }
        }
      },
    },
    {
      name: 'API - Filter invoices by status',
      action: async (ctx) => {
        for (const status of ['draft', 'sent', 'paid', 'overdue']) {
          const res = await ctx.api.get(`/api/v1/admin/invoices/?status=${status}`);
          if (res.ok) {
            const items = Array.isArray(res.data) ? res.data : res.data.results || [];
            ctx.log(`Status '${status}': ${items.length} invoices`);
          } else {
            ctx.log(`Filter by '${status}' -> ${res.status}`);
          }
        }
      },
    },
    {
      name: 'API - Invoice detail',
      action: async (ctx) => {
        if (!ctx.data.invoiceId) {
          ctx.log('No invoice available, skipping detail');
          return;
        }
        const res = await ctx.api.get(`/api/v1/admin/invoices/${ctx.data.invoiceId}/`);
        ctx.log(`GET invoice detail -> ${res.status}`);
        if (res.ok) {
          ctx.log(`Invoice #${res.data.invoice_number || res.data.id}, status: ${res.data.status}`);
        }
      },
    },
    {
      name: 'API - Search invoices',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/admin/invoices/?search=test');
        ctx.log(`GET /api/v1/admin/invoices/?search=test -> ${res.status}`);
      },
    },
  ],
};

export default scenario;
