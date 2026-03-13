import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'ppmob-07-dashboard',
  name: 'ProjeXtPal Mobile - Dashboard Data',
  app: 'projectpal_mobile',
  description: 'Test dashboard summary endpoints used by mobile home screen',
  tags: ['dashboard', 'core', 'smoke'],
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
      name: 'API - Get project summary counts',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/projects/');
        if (res.ok) {
          const projects = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.data.projectCount = projects.length;
          ctx.log(`Dashboard projects count: ${projects.length}`);
        } else {
          ctx.reportIssue({
            type: 'bug',
            severity: 'major',
            title: 'Cannot load project summary for mobile dashboard',
            description: `GET /api/v1/projects/ returned ${res.status}`,
            suggestion: 'Mobile home screen requires project counts for summary widgets.',
          });
        }
      },
    },
    {
      name: 'API - Get task summary counts',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/projects/tasks/');
        if (res.ok) {
          const tasks = Array.isArray(res.data) ? res.data : res.data.results || [];
          const byStatus: Record<string, number> = {};
          for (const task of tasks) {
            const status = task.status || 'unknown';
            byStatus[status] = (byStatus[status] || 0) + 1;
          }
          ctx.log(`Task breakdown: ${JSON.stringify(byStatus)}`);
        } else {
          ctx.log(`Tasks endpoint -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Get upcoming milestones',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/projects/milestones/');
        if (res.ok) {
          const milestones = Array.isArray(res.data) ? res.data : res.data.results || [];
          const upcoming = milestones.filter((m: any) => m.due_date && new Date(m.due_date) > new Date());
          ctx.log(`Upcoming milestones: ${upcoming.length} of ${milestones.length} total`);
        } else {
          ctx.log(`Milestones -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Get user profile for greeting',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/users/me/');
        if (res.ok) {
          ctx.log(`Dashboard greeting: ${res.data.first_name || res.data.username || res.data.email}`);
        } else {
          ctx.log(`User profile -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Get recent notifications count',
      action: async (ctx) => {
        const endpoints = ['/api/v1/notifications/', '/api/v1/users/notifications/'];
        for (const ep of endpoints) {
          const res = await ctx.api.get(ep);
          if (res.ok) {
            const items = Array.isArray(res.data) ? res.data : res.data.results || [];
            const unread = items.filter((n: any) => !n.read && !n.is_read).length;
            ctx.log(`Notifications: ${items.length} total, ${unread} unread (badge count)`);
            return;
          }
        }
        ctx.log('No notification endpoint responded');
      },
    },
  ],
};

export default scenario;
