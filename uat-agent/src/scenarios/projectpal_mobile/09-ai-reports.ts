import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'ppmob-09-ai-reports',
  name: 'ProjeXtPal Mobile - AI Reports',
  app: 'projectpal_mobile',
  description: 'Test AI report generation and retrieval from mobile',
  tags: ['ai', 'reports', 'core'],
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
      name: 'API - Generate executive summary report',
      action: async (ctx) => {
        const res = await ctx.api.post('/api/v1/governance/reports/generate/', {
          type: 'executive_summary',
        });
        if (res.ok) {
          const hasContent = !!res.data.content || !!res.data.report || !!res.data.html;
          ctx.log(`Executive report generated: ${hasContent}`);
          if (res.data.content) {
            ctx.log(`Preview: "${String(res.data.content).substring(0, 80)}..."`);
          }
        } else {
          ctx.log(`Executive report -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Generate portfolio analysis report',
      action: async (ctx) => {
        const res = await ctx.api.post('/api/v1/governance/reports/generate/', {
          type: 'portfolio_analysis',
        });
        ctx.log(`Portfolio analysis report -> ${res.status} (ok: ${res.ok})`);
      },
    },
    {
      name: 'API - AI text generation for mobile summaries',
      action: async (ctx) => {
        const res = await ctx.api.post('/api/v1/governance/ai/generate/', {
          prompt: 'Give me a brief mobile-friendly project status update',
          type: 'summary',
        });
        if (res.ok) {
          ctx.log('AI text generation successful');
        } else {
          ctx.log(`AI text generation -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Project analysis from mobile',
      action: async (ctx) => {
        const projRes = await ctx.api.get('/api/v1/projects/');
        if (!projRes.ok) {
          ctx.log('Cannot list projects, skipping analysis');
          return;
        }
        const projects = Array.isArray(projRes.data) ? projRes.data : projRes.data.results || [];
        if (projects.length === 0) {
          ctx.log('No projects available for analysis');
          return;
        }
        const projectId = projects[0].id;
        const res = await ctx.api.get(`/api/v1/bot/project-analysis/${projectId}/`);
        ctx.log(`Project analysis for ${projectId} -> ${res.status}`);
        if (res.ok && res.data.analysis) {
          ctx.log(`Analysis preview: "${String(res.data.analysis).substring(0, 80)}..."`);
        }
      },
    },
  ],
};

export default scenario;
