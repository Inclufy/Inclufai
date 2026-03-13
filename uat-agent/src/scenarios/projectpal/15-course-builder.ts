import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'pp-15-course-builder',
  name: 'ProjeXtPal - Course Builder Pro',
  app: 'projectpal',
  description: 'Test admin course builder with CRUD, AI content generation, quiz builder, and file uploads',
  tags: ['academy', 'course-builder', 'admin', 'ai', 'crud'],
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
      name: 'Navigate to admin training page',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/admin/training`);
        await ctx.page.waitForLoadState('networkidle');
        const heading = await ctx.page.locator('h1, h2, [class*="title"]').first().textContent();
        ctx.log(`Admin training page loaded: ${heading}`);
      },
    },
    {
      name: 'Check course list in admin',
      action: async (ctx) => {
        const courseElements = await ctx.page.locator('table, [class*="list"], [class*="grid"], [class*="card"]').count();
        ctx.log(`Course list elements found: ${courseElements}`);

        const createBtn = ctx.page.locator('button, a').filter({ hasText: /create|new|add/i });
        const count = await createBtn.count();
        ctx.log(`Create course buttons found: ${count}`);
      },
    },
    {
      name: 'API - List admin courses',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/academy/courses/');
        if (res.ok) {
          const courses = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.data.courseCount = courses.length;
          ctx.log(`Admin courses: ${courses.length}`);
        } else {
          ctx.log(`List courses returned ${res.status}`);
        }
      },
    },
    {
      name: 'API - List modules',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/academy/modules/');
        ctx.log(`GET /api/v1/academy/modules/ -> ${res.status}`);
      },
    },
    {
      name: 'API - List lessons',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/academy/lessons/');
        if (res.ok) {
          const lessons = Array.isArray(res.data) ? res.data : res.data.results || [];
          if (lessons.length > 0) {
            ctx.data.lessonId = lessons[0].id;
          }
          ctx.log(`Lessons found: ${lessons.length}`);
        } else {
          ctx.log(`List lessons returned ${res.status}`);
        }
      },
    },
    {
      name: 'API - AI generate content',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.post('/api/v1/academy/ai/generate-content/', {
          topic: 'Introduction to Agile Project Management',
          type: 'lesson',
        });
        if (res.ok) {
          ctx.log('AI content generation successful');
        } else {
          ctx.log(`AI generate-content returned ${res.status}`);
        }
      },
    },
    {
      name: 'API - AI generate quiz',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.post('/api/v1/academy/ai/generate-quiz/', {
          topic: 'Scrum Fundamentals',
          num_questions: 3,
        });
        if (res.ok) {
          ctx.log('AI quiz generation successful');
        } else {
          ctx.log(`AI generate-quiz returned ${res.status}`);
        }
      },
    },
    {
      name: 'API - AI generate simulation',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.post('/api/v1/academy/ai/generate-simulation/', {
          topic: 'Sprint Planning Meeting',
        });
        ctx.log(`AI generate-simulation -> ${res.status}`);
      },
    },
    {
      name: 'API - AI generate assignment',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.post('/api/v1/academy/ai/generate-assignment/', {
          topic: 'Create a project charter',
        });
        ctx.log(`AI generate-assignment -> ${res.status}`);
      },
    },
    {
      name: 'API - AI generate exam',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.post('/api/v1/academy/ai/generate-exam/', {
          topic: 'PRINCE2 Foundation',
          num_questions: 5,
        });
        ctx.log(`AI generate-exam -> ${res.status}`);
      },
    },
    {
      name: 'API - AI extract skills from content',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.post('/api/v1/academy/ai/extract-skills/', {
          content: 'This lesson covers risk management, stakeholder analysis, and budget planning in PRINCE2 projects.',
        });
        ctx.log(`AI extract-skills -> ${res.status}`);
      },
    },
    {
      name: 'API - AI analyze lesson',
      action: async (ctx) => {
        if (!ctx.data.lessonId) {
          ctx.log('No lesson ID available, skipping');
          return;
        }
        const res = await ctx.api.get(`/api/v1/academy/ai/analyze-lesson/${ctx.data.lessonId}/`);
        ctx.log(`AI analyze lesson ${ctx.data.lessonId} -> ${res.status}`);
      },
    },
    {
      name: 'API - Admin generate course with AI',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.post('/api/v1/academy/admin/ai/generate-course/', {
          title: 'UAT Test Course - Kanban Basics',
          description: 'A test course generated by UAT agent',
        });
        ctx.log(`Admin AI generate-course -> ${res.status}`);
      },
    },
    {
      name: 'API - Admin skills management',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const listRes = await ctx.api.get('/api/v1/academy/admin/skills/');
        ctx.log(`Admin list skills -> ${listRes.status}`);

        const genRes = await ctx.api.post('/api/v1/academy/admin/skills/generate/', {
          topic: 'Agile methodologies',
        });
        ctx.log(`Admin generate skills -> ${genRes.status}`);
      },
    },
  ],
};

export default scenario;
