import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'ppmob-03-tasks',
  name: 'ProjeXtPal Mobile - Task Management',
  app: 'projectpal_mobile',
  description: 'Test task CRUD, status updates, and assignments from mobile',
  tags: ['tasks', 'core', 'critical'],
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
      name: 'API - List tasks',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/projects/tasks/');
        if (res.ok) {
          const tasks = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.data.tasks = tasks;
          if (tasks.length > 0) {
            ctx.data.existingTaskId = tasks[0].id;
          }
          ctx.log(`Tasks: ${tasks.length}`);
        }
      },
    },
    {
      name: 'API - Get projects for task creation',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/projects/');
        if (res.ok) {
          const projects = Array.isArray(res.data) ? res.data : res.data.results || [];
          if (projects.length > 0) {
            ctx.data.projectId = projects[0].id;
          }
        }
      },
    },
    {
      name: 'API - Create task from mobile',
      action: async (ctx) => {
        if (!ctx.data.projectId) {
          ctx.log('No project available, skipping task creation');
          return;
        }
        const res = await ctx.api.post('/api/v1/projects/tasks/', {
          title: 'Mobile UAT Task',
          description: 'Created from ProjeXtPal mobile UAT test',
          project: ctx.data.projectId,
          status: 'todo',
          priority: 'medium',
        });
        if (res.ok) {
          ctx.data.createdTaskId = res.data.id;
          ctx.log(`Task created: ${res.data.id}`);
        } else {
          ctx.log(`Create task -> ${res.status}: ${JSON.stringify(res.data).substring(0, 100)}`);
        }
      },
    },
    {
      name: 'API - Update task status from mobile',
      action: async (ctx) => {
        const taskId = ctx.data.createdTaskId || ctx.data.existingTaskId;
        if (!taskId) {
          ctx.log('No task to update, skipping');
          return;
        }
        const res = await ctx.api.patch(`/api/v1/projects/tasks/${taskId}/`, {
          status: 'in_progress',
        });
        ctx.log(`PATCH task ${taskId} -> ${res.status}`);
      },
    },
    {
      name: 'API - Task detail view',
      action: async (ctx) => {
        const taskId = ctx.data.createdTaskId || ctx.data.existingTaskId;
        if (!taskId) {
          ctx.log('No task to view, skipping');
          return;
        }
        const res = await ctx.api.get(`/api/v1/projects/tasks/${taskId}/`);
        ctx.log(`GET task detail -> ${res.status}`);
        if (res.ok) {
          ctx.log(`Task: ${res.data.title}, status: ${res.data.status}`);
        }
      },
    },
    {
      name: 'Cleanup created task',
      action: async (ctx) => {
        if (ctx.data.createdTaskId) {
          await ctx.api.delete(`/api/v1/projects/tasks/${ctx.data.createdTaskId}/`);
          ctx.log('Cleaned up test task');
        }
      },
    },
  ],
};

export default scenario;
