import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mob-02-projects',
  name: 'Mobile - Projects & Tasks',
  app: 'mobile',
  description: 'Test project and task endpoints used by mobile app',
  tags: ['projects', 'tasks', 'core', 'critical'],
  steps: [
    {
      name: 'List projects',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/projects/');
        if (res.ok) {
          const projects = Array.isArray(res.data) ? res.data : res.data?.results || [];
          ctx.log(`Projects: ${projects.length} found`);
          if (projects.length > 0) {
            ctx.data.projectId = projects[0].id;
            ctx.data.projectName = projects[0].name;
          }
        } else {
          ctx.reportIssue({
            type: 'bug',
            severity: 'critical',
            title: 'Projects endpoint failed',
            description: `GET /api/v1/projects/ returned ${res.status}`,
            suggestion: 'Projects list is essential for mobile app home screen.',
          });
        }
      },
    },
    {
      name: 'List tasks',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/projects/tasks/');
        if (res.ok) {
          const tasks = Array.isArray(res.data) ? res.data : res.data?.results || [];
          ctx.log(`Tasks: ${tasks.length} found`);
          if (tasks.length > 0) {
            ctx.data.taskId = tasks[0].id;
          }
        } else {
          ctx.log(`Tasks endpoint: ${res.status}`);
        }
      },
    },
    {
      name: 'List milestones',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/projects/milestones/');
        if (res.ok) {
          const milestones = Array.isArray(res.data) ? res.data : res.data?.results || [];
          ctx.log(`Milestones: ${milestones.length} found`);
        } else {
          ctx.log(`Milestones endpoint: ${res.status}`);
        }
      },
    },
    {
      name: 'Project detail',
      action: async (ctx) => {
        if (!ctx.data.projectId) {
          ctx.log('No project available to test detail endpoint');
          return;
        }
        const res = await ctx.api.get(`/api/v1/projects/${ctx.data.projectId}/`);
        if (res.ok) {
          const fields = Object.keys(res.data);
          ctx.log(`Project detail fields: ${fields.slice(0, 10).join(', ')}${fields.length > 10 ? '...' : ''}`);
        } else {
          ctx.reportIssue({
            type: 'bug',
            severity: 'major',
            title: 'Project detail endpoint failed',
            description: `GET /api/v1/projects/${ctx.data.projectId}/ returned ${res.status}`,
            suggestion: 'Project detail view is needed for mobile project screen.',
          });
        }
      },
    },
  ],
};

export default scenario;
