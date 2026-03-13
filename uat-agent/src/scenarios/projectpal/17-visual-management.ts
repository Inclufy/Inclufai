import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'pp-17-visual-management',
  name: 'ProjeXtPal - Visual Management System',
  app: 'projectpal',
  description: 'Test visual templates, AI topic detection, dynamic rendering, and admin visual management',
  tags: ['visuals', 'ai', 'admin', 'templates'],
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
      name: 'Navigate to admin visual management page',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/admin-portal/visual-management`);
        await ctx.page.waitForLoadState('networkidle');
        const heading = await ctx.page.locator('h1, h2, [class*="title"]').first().textContent();
        ctx.log(`Visual management page loaded: ${heading}`);
      },
    },
    {
      name: 'Check visual templates are displayed',
      action: async (ctx) => {
        const templates = await ctx.page.locator(
          '[class*="template"], [class*="visual"], [class*="card"]'
        ).count();
        ctx.log(`Visual template elements found: ${templates}`);

        // Check for specific visual types
        const visualTypes = ['triple constraint', 'stakeholder', 'risk', 'lifecycle', 'pm role'];
        for (const vType of visualTypes) {
          const found = await ctx.page.locator(`text=/${vType}/i`).count();
          if (found > 0) {
            ctx.log(`Visual type '${vType}': found`);
          }
        }
      },
    },
    {
      name: 'API - List lesson visuals',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/academy/visuals/');
        ctx.log(`GET /api/v1/academy/visuals/ -> ${res.status}`);
        if (res.ok) {
          const items = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.log(`Lesson visuals found: ${items.length}`);
        }
      },
    },
    {
      name: 'API - Analyze lesson for visual selection',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        // Get a lesson first
        const lessonsRes = await ctx.api.get('/api/v1/academy/lessons/');
        if (lessonsRes.ok) {
          const lessons = Array.isArray(lessonsRes.data) ? lessonsRes.data : lessonsRes.data.results || [];
          if (lessons.length > 0) {
            const lessonId = lessons[0].id;
            const res = await ctx.api.get(`/api/v1/academy/analyze-lesson/`);
            ctx.log(`Analyze lesson endpoint -> ${res.status}`);

            // Try AI visual generation
            const genRes = await ctx.api.get(`/api/v1/academy/ai/analyze-lesson/${lessonId}/`);
            ctx.log(`AI analyze lesson ${lessonId} -> ${genRes.status}`);
          } else {
            ctx.log('No lessons available for analysis');
          }
        }
      },
    },
    {
      name: 'API - Generate visual for lesson',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const lessonsRes = await ctx.api.get('/api/v1/academy/lessons/');
        if (lessonsRes.ok) {
          const lessons = Array.isArray(lessonsRes.data) ? lessonsRes.data : lessonsRes.data.results || [];
          if (lessons.length > 0) {
            const lessonId = lessons[0].id;
            const visualTypes = ['triple_constraint', 'stakeholder_map', 'risk_matrix'];
            for (const vType of visualTypes) {
              const res = await ctx.api.get(`/api/v1/academy/ai/generate-visual/${lessonId}/${vType}/`);
              ctx.log(`Generate visual '${vType}' for lesson ${lessonId} -> ${res.status}`);
              if (res.ok) break; // At least one should work
            }
          }
        }
      },
    },
    {
      name: 'API - Admin update lesson visual',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const lessonsRes = await ctx.api.get('/api/v1/academy/lessons/');
        if (lessonsRes.ok) {
          const lessons = Array.isArray(lessonsRes.data) ? lessonsRes.data : lessonsRes.data.results || [];
          if (lessons.length > 0) {
            const lessonId = lessons[0].id;
            const res = await ctx.api.get(`/api/v1/academy/admin/lessons/${lessonId}/visual/`);
            ctx.log(`Admin get lesson visual ${lessonId} -> ${res.status}`);
          }
        }
      },
    },
    {
      name: 'Check visual rendering on a course page',
      action: async (ctx) => {
        // Navigate to academy and check if visuals render in course content
        const coursesRes = await ctx.api.get('/api/v1/academy/courses/');
        if (coursesRes.ok) {
          const courses = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.results || [];
          if (courses.length > 0) {
            await ctx.page.goto(`${ctx.app.baseUrl}/academy/course/${courses[0].id}`);
            await ctx.page.waitForLoadState('networkidle');

            const visuals = await ctx.page.locator(
              'svg, canvas, [class*="visual"], [class*="diagram"], [class*="chart"]'
            ).count();
            ctx.log(`Visual elements on course page: ${visuals}`);
          }
        }
      },
    },
  ],
};

export default scenario;
