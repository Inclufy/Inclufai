import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'ppmob-08-kanban',
  name: 'ProjeXtPal Mobile - Kanban Board',
  app: 'projectpal_mobile',
  description: 'Test Kanban board data endpoints for mobile card/column views',
  tags: ['kanban', 'methodology', 'core'],
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
      name: 'API - List Kanban boards',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/kanban/boards/');
        if (res.ok) {
          const boards = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.log(`Kanban boards: ${boards.length}`);
          if (boards.length > 0) {
            ctx.data.boardId = boards[0].id;
          }
        } else {
          ctx.log(`Kanban boards endpoint -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Get board detail with columns',
      action: async (ctx) => {
        if (!ctx.data.boardId) {
          ctx.log('No board available, skipping');
          return;
        }
        const res = await ctx.api.get(`/api/v1/kanban/boards/${ctx.data.boardId}/`);
        if (res.ok) {
          const columns = res.data.columns || [];
          ctx.log(`Board: ${res.data.name || res.data.title}, columns: ${columns.length}`);
          ctx.data.columns = columns;
        } else {
          ctx.log(`Board detail -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - List tasks grouped by status (mobile Kanban view)',
      action: async (ctx) => {
        // Mobile Kanban often uses tasks grouped by status as columns
        const res = await ctx.api.get('/api/v1/projects/tasks/');
        if (res.ok) {
          const tasks = Array.isArray(res.data) ? res.data : res.data.results || [];
          const byStatus: Record<string, number> = {};
          for (const task of tasks) {
            const status = task.status || 'unknown';
            byStatus[status] = (byStatus[status] || 0) + 1;
          }
          ctx.log(`Kanban columns from task status: ${JSON.stringify(byStatus)}`);
        } else {
          ctx.log(`Tasks for Kanban -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Move task between columns (status update)',
      action: async (ctx) => {
        // Get a task to move
        const res = await ctx.api.get('/api/v1/projects/tasks/');
        if (!res.ok) {
          ctx.log('Cannot list tasks, skipping drag simulation');
          return;
        }
        const tasks = Array.isArray(res.data) ? res.data : res.data.results || [];
        if (tasks.length === 0) {
          ctx.log('No tasks to move, skipping');
          return;
        }
        const task = tasks[0];
        const originalStatus = task.status;
        const newStatus = originalStatus === 'in_progress' ? 'done' : 'in_progress';

        const patchRes = await ctx.api.patch(`/api/v1/projects/tasks/${task.id}/`, {
          status: newStatus,
        });
        if (patchRes.ok) {
          ctx.log(`Moved task ${task.id}: ${originalStatus} -> ${newStatus}`);
          // Revert
          await ctx.api.patch(`/api/v1/projects/tasks/${task.id}/`, {
            status: originalStatus,
          });
          ctx.log(`Reverted task ${task.id} back to ${originalStatus}`);
        } else {
          ctx.log(`Move task -> ${patchRes.status}`);
        }
      },
    },
  ],
};

export default scenario;
