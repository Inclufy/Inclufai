import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mob-07-task-crud',
  name: 'Mobile - Task & Milestone CRUD',
  app: 'mobile',
  description: 'Test task creation, update, status changes, and milestone management via mobile API',
  tags: ['tasks', 'milestones', 'crud', 'core'],
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
        throw new Error('Mobile login failed');
      },
    },
    {
      name: 'API - List projects',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/projects/');
        if (res.ok) {
          const projects = Array.isArray(res.data) ? res.data : res.data.results || [];
          if (projects.length > 0) {
            ctx.data.projectId = projects[0].id;
          }
          ctx.log(`Projects: ${projects.length}`);
        } else {
          ctx.log(`List projects returned ${res.status}`);
        }
      },
    },
    {
      name: 'API - List tasks',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/projects/tasks/');
        if (res.ok) {
          const tasks = Array.isArray(res.data) ? res.data : res.data.results || [];
          if (tasks.length > 0) {
            ctx.data.existingTaskId = tasks[0].id;
          }
          ctx.log(`Tasks: ${tasks.length}`);
        } else {
          ctx.log(`List tasks returned ${res.status}`);
        }
      },
    },
    {
      name: 'API - Create task',
      action: async (ctx) => {
        if (!ctx.data.projectId) {
          ctx.log('No project ID, skipping task creation');
          return;
        }
        const res = await ctx.api.post('/api/v1/projects/tasks/', {
          title: 'UAT Mobile Test Task',
          description: 'Created by UAT agent mobile test',
          project: ctx.data.projectId,
          status: 'todo',
          priority: 'medium',
        });
        if (res.ok) {
          ctx.data.taskId = res.data.id;
          ctx.log(`Task created: ${res.data.id}`);
        } else {
          ctx.log(`Create task returned ${res.status}: ${JSON.stringify(res.data).substring(0, 100)}`);
        }
      },
    },
    {
      name: 'API - Update task status',
      action: async (ctx) => {
        const taskId = ctx.data.taskId || ctx.data.existingTaskId;
        if (!taskId) {
          ctx.log('No task ID, skipping');
          return;
        }
        const res = await ctx.api.patch(`/api/v1/projects/tasks/${taskId}/`, {
          status: 'in_progress',
        });
        ctx.log(`PATCH task ${taskId} status -> ${res.status}`);
      },
    },
    {
      name: 'API - List milestones',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/projects/milestones/');
        if (res.ok) {
          const milestones = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.log(`Milestones: ${milestones.length}`);
        } else {
          ctx.log(`List milestones returned ${res.status}`);
        }
      },
    },
    {
      name: 'API - Bot chat from mobile',
      action: async (ctx) => {
        const chatRes = await ctx.api.post('/api/v1/bot/chats/', {
          title: 'Mobile UAT Chat',
        });
        if (chatRes.ok) {
          ctx.data.chatId = chatRes.data.id;
          const msgRes = await ctx.api.post(`/api/v1/bot/chats/${chatRes.data.id}/send_message/`, {
            message: 'What are my overdue tasks?',
            language: 'en',
          });
          if (msgRes.ok) {
            ctx.log(`Mobile AI chat response: ${!!msgRes.data.ai_response}`);
          } else {
            ctx.log(`Mobile chat message returned ${msgRes.status}`);
          }
        }
      },
    },
    {
      name: 'API - Surveys',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/surveys/');
        ctx.log(`GET /api/v1/surveys/ -> ${res.status}`);
      },
    },
    {
      name: 'API - Subscriptions',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/subscriptions/');
        ctx.log(`GET /api/v1/subscriptions/ -> ${res.status}`);
      },
    },
    {
      name: 'Cleanup test task',
      action: async (ctx) => {
        if (ctx.data.taskId) {
          await ctx.api.delete(`/api/v1/projects/tasks/${ctx.data.taskId}/`);
          ctx.log('Cleaned up test task');
        }
      },
    },
  ],
};

export default scenario;
