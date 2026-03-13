import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'ppmob-02-projects',
  name: 'ProjeXtPal Mobile - Projects',
  app: 'projectpal_mobile',
  description: 'Test project listing, detail views, and project data from mobile',
  tags: ['projects', 'core', 'critical'],
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
      name: 'API - List projects',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/projects/');
        if (res.ok) {
          const projects = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.data.projects = projects;
          if (projects.length > 0) {
            ctx.data.projectId = projects[0].id;
          }
          ctx.log(`Projects: ${projects.length}`);
        } else {
          ctx.log(`List projects -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Project detail',
      action: async (ctx) => {
        if (!ctx.data.projectId) {
          ctx.log('No project available, skipping');
          return;
        }
        const res = await ctx.api.get(`/api/v1/projects/${ctx.data.projectId}/`);
        ctx.log(`GET project detail -> ${res.status}`);
        if (res.ok) {
          ctx.log(`Project: ${res.data.name || res.data.title}`);
        }
      },
    },
    {
      name: 'API - Project milestones',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/projects/milestones/');
        if (res.ok) {
          const items = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.log(`Milestones: ${items.length}`);
        } else {
          ctx.log(`Milestones -> ${res.status}`);
        }
      },
    },
  ],
};

export default scenario;
