import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mob-05-programs',
  name: 'Mobile - Programs & Governance',
  app: 'mobile',
  description: 'Test programs and governance endpoints for mobile app',
  tags: ['programs', 'governance', 'core'],
  steps: [
    {
      name: 'List programs',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/programs/');
        if (res.ok) {
          const programs = Array.isArray(res.data) ? res.data : res.data?.results || [];
          ctx.log(`Programs: ${programs.length} found`);
        } else {
          ctx.log(`Programs endpoint: ${res.status}`);
        }
      },
    },
    {
      name: 'Governance endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/governance/');
        ctx.log(`Governance endpoint: ${res.status} (${res.ok ? 'OK' : 'FAIL'})`);
      },
    },
    {
      name: 'Governance portfolios',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/governance/portfolios/');
        if (res.ok) {
          const portfolios = Array.isArray(res.data) ? res.data : res.data?.results || [];
          ctx.log(`Portfolios: ${portfolios.length} found`);
        } else {
          ctx.log(`Portfolios endpoint: ${res.status}`);
        }
      },
    },
    {
      name: 'Governance stakeholders',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/governance/stakeholders/');
        ctx.log(`Governance stakeholders endpoint: ${res.status} (${res.ok ? 'OK' : 'FAIL'})`);
      },
    },
  ],
};

export default scenario;
