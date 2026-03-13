import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'ppmob-12-governance',
  name: 'ProjeXtPal Mobile - Governance & Portfolios',
  app: 'projectpal_mobile',
  description: 'Test governance portfolio, stakeholder, and risk endpoints from mobile',
  tags: ['governance', 'portfolios', 'core'],
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
        throw new Error('ProjeXtPal Mobile login failed');
      },
    },
    {
      name: 'API - List governance portfolios',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/governance/portfolios/');
        if (res.ok) {
          const portfolios = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.log(`Portfolios: ${portfolios.length}`);
          if (portfolios.length > 0) {
            ctx.data.portfolioId = portfolios[0].id;
          }
        } else {
          ctx.log(`Portfolios -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Portfolio detail',
      action: async (ctx) => {
        if (!ctx.data.portfolioId) {
          ctx.log('No portfolio available, skipping');
          return;
        }
        const res = await ctx.api.get(`/api/v1/governance/portfolios/${ctx.data.portfolioId}/`);
        if (res.ok) {
          ctx.log(`Portfolio: ${res.data.name || res.data.title}`);
        } else {
          ctx.log(`Portfolio detail -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - List stakeholders',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/governance/stakeholders/');
        if (res.ok) {
          const stakeholders = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.log(`Stakeholders: ${stakeholders.length}`);
        } else {
          ctx.log(`Stakeholders -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - List risks',
      action: async (ctx) => {
        const endpoints = ['/api/v1/governance/risks/', '/api/v1/governance/risk-register/'];
        for (const ep of endpoints) {
          const res = await ctx.api.get(ep);
          if (res.ok) {
            const risks = Array.isArray(res.data) ? res.data : res.data.results || [];
            ctx.log(`Risks (${ep}): ${risks.length}`);
            return;
          }
        }
        ctx.log('No risk endpoint responded');
      },
    },
    {
      name: 'API - Governance overview',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/governance/');
        if (res.ok) {
          const keys = Object.keys(res.data);
          ctx.log(`Governance overview keys: ${keys.join(', ')}`);
        } else {
          ctx.log(`Governance overview -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Programs list',
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
  ],
};

export default scenario;
