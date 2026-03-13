import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'finmob-05-invoice-actions',
  name: 'Finance Mobile - Invoice Actions',
  app: 'finance_mobile',
  description: 'Test invoice payment tracking, PDF download, and overdue checking from mobile',
  tags: ['invoices', 'workflows', 'critical'],
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
      name: 'API - Get invoices to work with',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/admin/invoices/');
        if (res.ok) {
          const items = Array.isArray(res.data) ? res.data : res.data.results || [];
          if (items.length > 0) {
            ctx.data.invoiceId = items[0].id;
            ctx.data.invoiceStatus = items[0].status;
          }
          ctx.log(`Found ${items.length} invoices`);
        }
      },
    },
    {
      name: 'API - Generate PDF from mobile',
      action: async (ctx) => {
        if (!ctx.data.invoiceId) {
          ctx.log('No invoice available, skipping');
          return;
        }
        const res = await ctx.api.post(`/api/v1/admin/invoices/${ctx.data.invoiceId}/generate_pdf/`);
        ctx.log(`Generate PDF -> ${res.status}`);
      },
    },
    {
      name: 'API - Mark invoice paid from mobile',
      action: async (ctx) => {
        if (!ctx.data.invoiceId) {
          ctx.log('No invoice available, skipping');
          return;
        }
        const res = await ctx.api.post(`/api/v1/admin/invoices/${ctx.data.invoiceId}/mark_paid/`, {
          payment_method: 'mobile_payment',
          payment_reference: 'MOBILE-UAT-001',
          paid_date: new Date().toISOString().split('T')[0],
        });
        ctx.log(`Mark paid -> ${res.status}`);
      },
    },
    {
      name: 'API - Check overdue from mobile',
      action: async (ctx) => {
        const res = await ctx.api.post('/api/v1/admin/invoices/check_overdue/');
        ctx.log(`Check overdue -> ${res.status}`);
      },
    },
    {
      name: 'API - Invoice settings',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/admin/invoice-settings/');
        ctx.log(`GET invoice settings -> ${res.status}`);
      },
    },
  ],
};

export default scenario;
