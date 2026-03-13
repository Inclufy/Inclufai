import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mob-04-academy',
  name: 'Mobile - Academy & Learning',
  app: 'mobile',
  description: 'Test academy course endpoints for mobile learning features',
  tags: ['academy', 'learning', 'core'],
  steps: [
    {
      name: 'List courses',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/academy/courses/');
        if (res.ok) {
          const courses = Array.isArray(res.data) ? res.data : res.data?.results || [];
          ctx.log(`Academy courses: ${courses.length} found`);
          if (courses.length > 0) {
            ctx.data.courseId = courses[0].id;
          }
        } else {
          ctx.log(`Academy courses endpoint: ${res.status}`);
        }
      },
    },
    {
      name: 'Course detail',
      action: async (ctx) => {
        if (!ctx.data.courseId) {
          ctx.log('No course available to test detail endpoint');
          return;
        }
        const res = await ctx.api.get(`/api/v1/academy/courses/${ctx.data.courseId}/`);
        if (res.ok) {
          ctx.log(`Course detail: ${res.data.title || res.data.name || 'loaded'}`);
        } else {
          ctx.log(`Course detail endpoint: ${res.status}`);
        }
      },
    },
  ],
};

export default scenario;
