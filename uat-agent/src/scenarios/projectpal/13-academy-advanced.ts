import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'pp-13-academy-advanced',
  name: 'ProjeXtPal - Academy Advanced Features',
  app: 'projectpal',
  description: 'Test quiz engine, certificates, skills system, AI coach, and practice assignments',
  tags: ['academy', 'quiz', 'certificates', 'skills', 'ai', 'core'],
  steps: [
    {
      name: 'Login and authenticate',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/login`);
        await ctx.page.fill('input[type="email"]', ctx.app.credentials.email);
        await ctx.page.fill('input[type="password"]', ctx.app.credentials.password);
        await ctx.page.click('button[type="submit"]');
        await ctx.page.waitForURL(/dashboard|projects/, { timeout: 15000 });

        const token = await ctx.page.evaluate(() => {
          return localStorage.getItem('token') || localStorage.getItem('access_token') || '';
        });
        if (token) {
          ctx.api.setToken(token);
          ctx.data.authToken = token;
        }
        ctx.log('Logged in successfully');
      },
    },
    {
      name: 'Navigate to academy marketplace',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/academy`);
        await ctx.page.waitForLoadState('networkidle');
        ctx.log('Academy page loaded');
      },
    },
    {
      name: 'API - List courses',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/academy/courses/');
        if (res.ok) {
          const courses = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.data.courseCount = courses.length;
          if (courses.length > 0) {
            ctx.data.courseId = courses[0].id;
            ctx.data.courseSlug = courses[0].slug;
          }
          ctx.log(`Courses found: ${courses.length}`);
        } else {
          ctx.log(`List courses returned ${res.status}`);
        }
      },
    },
    {
      name: 'API - Skills system - list categories',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/academy/skills/categories/');
        ctx.log(`GET /api/v1/academy/skills/categories/ -> ${res.status}`);
        if (res.ok) {
          const items = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.log(`Skill categories found: ${items.length}`);
        }
      },
    },
    {
      name: 'API - Skills system - list skills',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/academy/skills/');
        ctx.log(`GET /api/v1/academy/skills/ -> ${res.status}`);
        if (res.ok) {
          const items = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.log(`Skills found: ${items.length}`);
        }
      },
    },
    {
      name: 'API - Skills system - user skills',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/academy/skills/user-skills/');
        ctx.log(`GET /api/v1/academy/skills/user-skills/ -> ${res.status}`);
      },
    },
    {
      name: 'API - Skills system - skill goals',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/academy/skills/goals/');
        ctx.log(`GET /api/v1/academy/skills/goals/ -> ${res.status}`);
      },
    },
    {
      name: 'API - Skills system - skill activities',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/academy/skills/activities/');
        ctx.log(`GET /api/v1/academy/skills/activities/ -> ${res.status}`);
      },
    },
    {
      name: 'API - Quiz engine - get quiz for lesson',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        // First get a lesson ID from a course
        const modulesRes = await ctx.api.get('/api/v1/academy/modules/');
        if (modulesRes.ok) {
          const modules = Array.isArray(modulesRes.data) ? modulesRes.data : modulesRes.data.results || [];
          ctx.log(`Modules found: ${modules.length}`);
        }

        const lessonsRes = await ctx.api.get('/api/v1/academy/lessons/');
        if (lessonsRes.ok) {
          const lessons = Array.isArray(lessonsRes.data) ? lessonsRes.data : lessonsRes.data.results || [];
          ctx.log(`Lessons found: ${lessons.length}`);
          if (lessons.length > 0) {
            ctx.data.lessonId = lessons[0].id;
            // Try to get quiz for this lesson
            const quizRes = await ctx.api.get(`/api/v1/academy/quiz/${lessons[0].id}/`);
            ctx.log(`GET quiz for lesson ${lessons[0].id} -> ${quizRes.status}`);
          }
        } else {
          ctx.log(`List lessons returned ${lessonsRes.status}`);
        }
      },
    },
    {
      name: 'API - Certificate endpoints',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        // List certificates via admin endpoint
        const res = await ctx.api.get('/api/v1/academy/admin/certificates/');
        ctx.log(`GET /api/v1/academy/admin/certificates/ -> ${res.status}`);

        const statsRes = await ctx.api.get('/api/v1/academy/admin/certificates/stats/');
        ctx.log(`GET /api/v1/academy/admin/certificates/stats/ -> ${statsRes.status}`);
      },
    },
    {
      name: 'API - Practice assignments',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/academy/admin/practice/');
        ctx.log(`GET /api/v1/academy/admin/practice/ -> ${res.status}`);
      },
    },
    {
      name: 'API - Exams endpoint',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/academy/admin/exams/');
        ctx.log(`GET /api/v1/academy/admin/exams/ -> ${res.status}`);
      },
    },
    {
      name: 'UI - Check for quiz/skills elements on course page',
      action: async (ctx) => {
        if (!ctx.data.courseId) {
          ctx.log('No course available, skipping UI check');
          return;
        }
        await ctx.page.goto(`${ctx.app.baseUrl}/academy/course/${ctx.data.courseId}`);
        await ctx.page.waitForLoadState('networkidle');

        const quizElements = await ctx.page.locator('text=/quiz|assessment|test/i').count();
        const skillElements = await ctx.page.locator('text=/skill|competenc/i').count();
        const certElements = await ctx.page.locator('text=/certificate|credential/i').count();

        ctx.log(`Course page - Quiz refs: ${quizElements}, Skill refs: ${skillElements}, Cert refs: ${certElements}`);
      },
    },
  ],
};

export default scenario;
