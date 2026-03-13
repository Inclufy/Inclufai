import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'go-06-ai-marketing',
  name: 'Inclufy GO - AI Marketing Intelligence',
  app: 'go',
  description: 'Test AI Marketing, Intelligentie, AI tab, and AI-powered recommendations',
  tags: ['ai', 'marketing', 'intelligence', 'core'],
  steps: [
    {
      name: 'Login',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/login`);
        await ctx.page.fill('input[type="email"], input[name="email"]', ctx.app.credentials.email);
        await ctx.page.fill('input[type="password"]', ctx.app.credentials.password);
        await ctx.page.click('button[type="submit"], button:has-text("Inloggen"), button:has-text("Login")');
        await ctx.page.waitForURL(/dashboard|home/, { timeout: 15000 });

        const token = await ctx.page.evaluate(() => {
          return localStorage.getItem('token') || localStorage.getItem('access_token') || '';
        });
        if (token) {
          ctx.api.setToken(token);
          ctx.data.authToken = token;
        }
      },
    },
    {
      name: 'Navigate to AI Marketing page',
      action: async (ctx) => {
        const aiNav = ctx.page.locator('a, [role="menuitem"]').filter({ hasText: /AI Marketing/i });
        if ((await aiNav.count()) > 0) {
          await aiNav.first().click();
          await ctx.page.waitForLoadState('networkidle');
          ctx.log('Navigated to AI Marketing');
        } else {
          const routes = ['/ai-marketing', '/ai', '/marketing/ai'];
          for (const route of routes) {
            await ctx.page.goto(`${ctx.app.baseUrl}${route}`);
            await ctx.page.waitForLoadState('networkidle');
            const body = (await ctx.page.textContent('body') || '').toLowerCase();
            if (body.length > 100 && !body.includes('404')) {
              ctx.log(`AI Marketing loaded at ${route}`);
              return;
            }
          }
          ctx.log('AI Marketing page not found');
        }
      },
    },
    {
      name: 'Check AI Marketing features',
      action: async (ctx) => {
        const aiFeatures = await ctx.page.locator(
          '[class*="ai"], [class*="recommendation"], [class*="insight"]'
        ).count();
        ctx.log(`AI feature elements: ${aiFeatures}`);

        // Check for AI-generated insights
        const insights = await ctx.page.locator('text=/inzicht|insight|aanbeveling|recommendation/i').count();
        ctx.log(`Insight/recommendation elements: ${insights}`);
      },
    },
    {
      name: 'Navigate to Intelligentie (Intelligence)',
      action: async (ctx) => {
        const intNav = ctx.page.locator('a, [role="menuitem"]').filter({ hasText: /Intelligentie|Intelligence/i });
        if ((await intNav.count()) > 0) {
          await intNav.first().click();
          await ctx.page.waitForLoadState('networkidle');
          ctx.log('Navigated to Intelligence');
        } else {
          await ctx.page.goto(`${ctx.app.baseUrl}/intelligence`);
          await ctx.page.waitForLoadState('networkidle');
          ctx.log('Navigated to Intelligence directly');
        }

        const content = await ctx.page.locator('h1, h2, [class*="title"]').first().textContent().catch(() => '');
        ctx.log(`Intelligence page title: ${content}`);
      },
    },
    {
      name: 'Navigate to AI tab (bottom navigation)',
      action: async (ctx) => {
        // Bottom nav AI tab
        const aiTab = ctx.page.locator('nav a, [class*="nav"] a, [class*="tab"]').filter({ hasText: /^AI$/i });
        if ((await aiTab.count()) > 0) {
          await aiTab.first().click();
          await ctx.page.waitForLoadState('networkidle');
          ctx.log('AI tab opened from bottom navigation');

          // Check AI chat/assistant interface
          const chatInput = await ctx.page.locator(
            'input[placeholder*="vraag" i], input[placeholder*="ask" i], textarea, [class*="chat-input"]'
          ).count();
          ctx.log(`AI chat input found: ${chatInput > 0}`);
        } else {
          ctx.log('AI bottom nav tab not found');
        }
      },
    },
    {
      name: 'API - AI chat/bot endpoint',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        // Create a chat
        const chatRes = await ctx.api.post('/api/v1/bot/chats/', {
          title: 'GO Marketing AI Test',
        });
        if (chatRes.ok) {
          ctx.data.chatId = chatRes.data.id;
          ctx.log(`Chat created: ${chatRes.data.id}`);

          // Send a marketing query
          const msgRes = await ctx.api.post(`/api/v1/bot/chats/${chatRes.data.id}/send_message/`, {
            message: 'Analyseer mijn marketing prestaties van deze maand',
            language: 'nl',
          });
          if (msgRes.ok) {
            ctx.log(`AI marketing query responded: ${!!msgRes.data.ai_response}`);
          } else {
            ctx.log(`AI message returned ${msgRes.status}`);
          }
        } else {
          ctx.log(`Create chat returned ${chatRes.status}`);
        }
      },
    },
  ],
};

export default scenario;
