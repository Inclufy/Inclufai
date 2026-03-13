import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'pp-14-ai-commander',
  name: 'ProjeXtPal - AI Commander & Bot Chat',
  app: 'projectpal',
  description: 'Test AI command palette, bot chat, project analysis, and public chat endpoints',
  tags: ['ai', 'chat', 'bot', 'commander', 'core'],
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
      name: 'Open AI Commander via keyboard shortcut or button',
      action: async (ctx) => {
        // Try Cmd+K / Ctrl+K shortcut first
        await ctx.page.keyboard.press('Control+k');
        await ctx.page.waitForTimeout(1000);

        const commandPalette = await ctx.page.locator(
          '[class*="commander" i], [class*="command-palette" i], [class*="CommandPalette" i], [role="dialog"][class*="search" i], [data-testid*="commander" i]'
        ).count();

        if (commandPalette > 0) {
          ctx.data.commanderOpened = true;
          ctx.log('AI Commander opened via Ctrl+K');
        } else {
          // Try button click
          const cmdBtn = ctx.page.locator(
            'button[aria-label*="command" i], button[class*="commander" i], button[class*="search" i], [data-testid*="commander"]'
          );
          if ((await cmdBtn.count()) > 0) {
            await cmdBtn.first().click();
            await ctx.page.waitForTimeout(1000);
            ctx.data.commanderOpened = true;
            ctx.log('AI Commander opened via button');
          } else {
            ctx.log('Could not find AI Commander trigger');
          }
        }

        // Close commander if opened
        if (ctx.data.commanderOpened) {
          await ctx.page.keyboard.press('Escape');
          await ctx.page.waitForTimeout(500);
        }
      },
    },
    {
      name: 'Check AI Commander input and quick actions',
      action: async (ctx) => {
        // Reopen commander
        await ctx.page.keyboard.press('Control+k');
        await ctx.page.waitForTimeout(1000);

        const searchInput = await ctx.page.locator(
          'input[placeholder*="search" i], input[placeholder*="command" i], input[placeholder*="ask" i], input[class*="commander" i]'
        ).count();
        ctx.log(`Commander search input found: ${searchInput > 0}`);

        const quickActions = await ctx.page.locator(
          '[class*="action" i], [class*="suggestion" i], [class*="quick" i]'
        ).count();
        ctx.log(`Quick action elements found: ${quickActions}`);

        await ctx.page.keyboard.press('Escape');
      },
    },
    {
      name: 'API - Bot chat create',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.post('/api/v1/bot/chats/', {
          title: 'UAT Commander Test Chat',
        });
        if (res.ok) {
          ctx.data.chatId = res.data.id;
          ctx.log(`Chat created with ID: ${res.data.id}`);
        } else {
          ctx.log(`Create chat returned ${res.status}: ${JSON.stringify(res.data)}`);
        }
      },
    },
    {
      name: 'API - Bot chat send English message',
      action: async (ctx) => {
        if (!ctx.data.chatId) {
          ctx.log('No chat ID, skipping');
          return;
        }
        const res = await ctx.api.post(`/api/v1/bot/chats/${ctx.data.chatId}/send_message/`, {
          message: 'Show me a summary of all active projects',
          language: 'en',
        });
        if (res.ok) {
          const hasResponse = !!res.data.ai_response;
          ctx.log(`English message sent, AI responded: ${hasResponse}`);
          if (res.data.ai_response?.content) {
            ctx.log(`AI: "${res.data.ai_response.content.substring(0, 100)}..."`);
          }
        } else {
          ctx.log(`Send message returned ${res.status}`);
        }
      },
    },
    {
      name: 'API - Bot chat send Dutch message',
      action: async (ctx) => {
        if (!ctx.data.chatId) {
          ctx.log('No chat ID, skipping');
          return;
        }
        const res = await ctx.api.post(`/api/v1/bot/chats/${ctx.data.chatId}/send_message/`, {
          message: 'Geef me een overzicht van alle actieve taken',
          language: 'nl',
        });
        if (res.ok) {
          const hasResponse = !!res.data.ai_response;
          ctx.log(`Dutch message sent, AI responded: ${hasResponse}`);
        } else {
          ctx.log(`Dutch message returned ${res.status}`);
        }
      },
    },
    {
      name: 'API - Bot chat history',
      action: async (ctx) => {
        if (!ctx.data.chatId) {
          ctx.log('No chat ID, skipping');
          return;
        }
        const res = await ctx.api.get(`/api/v1/bot/chats/${ctx.data.chatId}/history/`);
        if (res.ok) {
          const msgCount = res.data.messages?.length || 0;
          ctx.log(`Chat history has ${msgCount} messages`);
        } else {
          ctx.log(`History returned ${res.status}`);
        }
      },
    },
    {
      name: 'API - Project analysis endpoint',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        // Get a project ID first
        const projRes = await ctx.api.get('/api/v1/projects/');
        if (projRes.ok) {
          const projects = Array.isArray(projRes.data) ? projRes.data : projRes.data.results || [];
          if (projects.length > 0) {
            const projectId = projects[0].id;
            const analysisRes = await ctx.api.get(`/api/v1/bot/project-analysis/${projectId}/`);
            ctx.log(`Project analysis for ${projectId} -> ${analysisRes.status}`);
          } else {
            ctx.log('No projects available for analysis');
          }
        }
      },
    },
    {
      name: 'API - Form submission endpoint',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.post('/api/v1/bot/form/submit/', {
          form_type: 'test',
          data: { name: 'UAT Test' },
        });
        ctx.log(`Form submission -> ${res.status}`);
      },
    },
    {
      name: 'API - Public chat endpoint (no auth)',
      action: async (ctx) => {
        // Test public chat without auth token
        const res = await ctx.api.post('/api/v1/bot/public/', {
          message: 'What is ProjeXtPal?',
        });
        ctx.log(`Public chat -> ${res.status} (ok: ${res.ok})`);
      },
    },
    {
      name: 'API - List all chats',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/bot/chats/');
        if (res.ok) {
          const chats = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.log(`Total chats: ${chats.length}`);
        } else {
          ctx.log(`List chats returned ${res.status}`);
        }
      },
    },
  ],
};

export default scenario;
