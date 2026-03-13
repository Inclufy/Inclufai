import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'fin-07-invoice-workflows',
  name: 'Finance - Invoice Workflows & Payment Tracking',
  app: 'finance',
  description: 'Test invoice generation, sending, PDF creation, payment tracking, cancellation, and overdue detection',
  tags: ['invoices', 'workflows', 'payments', 'critical'],
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
      name: 'API - Invoice settings management',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/admin/invoice-settings/');
        ctx.log(`GET /api/v1/admin/invoice-settings/ -> ${res.status}`);
        if (res.ok) {
          ctx.log(`Invoice settings loaded: ${JSON.stringify(res.data).substring(0, 100)}`);
        }
      },
    },
    {
      name: 'API - List invoices with filters',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        // List all invoices
        const allRes = await ctx.api.get('/api/v1/admin/invoices/');
        ctx.log(`GET /api/v1/admin/invoices/ -> ${allRes.status}`);
        if (allRes.ok) {
          const items = Array.isArray(allRes.data) ? allRes.data : allRes.data.results || [];
          ctx.data.invoiceCount = items.length;
          if (items.length > 0) {
            ctx.data.existingInvoiceId = items[0].id;
          }
          ctx.log(`Total invoices: ${items.length}`);
        }

        // Filter by status
        const statuses = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];
        for (const status of statuses) {
          const res = await ctx.api.get(`/api/v1/admin/invoices/?status=${status}`);
          if (res.ok) {
            const items = Array.isArray(res.data) ? res.data : res.data.results || [];
            ctx.log(`Invoices with status '${status}': ${items.length}`);
          }
        }
      },
    },
    {
      name: 'API - Invoice generation',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.post('/api/v1/admin/invoices/generate/', {
          billing_period: 'monthly',
          invoice_date: new Date().toISOString().split('T')[0],
        });
        if (res.ok) {
          ctx.log(`Invoice generation triggered successfully`);
          if (res.data.id) {
            ctx.data.generatedInvoiceId = res.data.id;
          }
        } else {
          ctx.log(`Invoice generation returned ${res.status}: ${JSON.stringify(res.data).substring(0, 100)}`);
        }
      },
    },
    {
      name: 'API - Invoice PDF generation',
      action: async (ctx) => {
        const invoiceId = ctx.data.generatedInvoiceId || ctx.data.existingInvoiceId;
        if (!invoiceId) {
          ctx.log('No invoice ID available, skipping PDF generation');
          return;
        }
        const res = await ctx.api.post(`/api/v1/admin/invoices/${invoiceId}/generate_pdf/`);
        ctx.log(`POST /api/v1/admin/invoices/${invoiceId}/generate_pdf/ -> ${res.status}`);
      },
    },
    {
      name: 'API - Invoice sending with email',
      action: async (ctx) => {
        const invoiceId = ctx.data.generatedInvoiceId || ctx.data.existingInvoiceId;
        if (!invoiceId) {
          ctx.log('No invoice ID available, skipping send');
          return;
        }
        const res = await ctx.api.post(`/api/v1/admin/invoices/${invoiceId}/send/`, {
          subject: 'UAT Test Invoice',
          message: 'This is a test invoice from UAT agent',
        });
        ctx.log(`POST /api/v1/admin/invoices/${invoiceId}/send/ -> ${res.status}`);
      },
    },
    {
      name: 'API - Mark invoice as paid',
      action: async (ctx) => {
        const invoiceId = ctx.data.generatedInvoiceId || ctx.data.existingInvoiceId;
        if (!invoiceId) {
          ctx.log('No invoice ID available, skipping');
          return;
        }
        const res = await ctx.api.post(`/api/v1/admin/invoices/${invoiceId}/mark_paid/`, {
          payment_method: 'bank_transfer',
          payment_reference: 'UAT-TEST-001',
          paid_date: new Date().toISOString().split('T')[0],
        });
        ctx.log(`POST /api/v1/admin/invoices/${invoiceId}/mark_paid/ -> ${res.status}`);
      },
    },
    {
      name: 'API - Check overdue invoices',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.post('/api/v1/admin/invoices/check_overdue/');
        ctx.log(`POST /api/v1/admin/invoices/check_overdue/ -> ${res.status}`);
      },
    },
    {
      name: 'API - Invoice cancellation',
      action: async (ctx) => {
        const invoiceId = ctx.data.generatedInvoiceId;
        if (!invoiceId) {
          ctx.log('No generated invoice to cancel, skipping');
          return;
        }
        const res = await ctx.api.post(`/api/v1/admin/invoices/${invoiceId}/cancel/`);
        ctx.log(`POST /api/v1/admin/invoices/${invoiceId}/cancel/ -> ${res.status}`);
      },
    },
  ],
};

export default scenario;
