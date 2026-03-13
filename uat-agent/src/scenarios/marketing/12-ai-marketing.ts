import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mkt-12-ai-marketing',
  name: 'Marketing - AI Marketing & Recommendations',
  app: 'marketing',
  description: 'Test AI-powered marketing recommendations, budget optimization, engagement analysis, and lead generation insights',
  tags: ['ai', 'marketing', 'recommendations', 'core'],
  steps: [
    {
      name: 'Login',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/login`);
        await ctx.page.fill('input[type="email"], input[name="email"]', ctx.app.credentials.email);
        await ctx.page.fill('input[type="password"]', ctx.app.credentials.password);
        await ctx.page.click('button[type="submit"]');
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
      name: 'Check dashboard AI recommendations',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/dashboard`);
        await ctx.page.waitForLoadState('networkidle');

        // AI Aanbevelingen section
        const aiSection = await ctx.page.locator('text=/AI Aanbevelingen|AI Recommendations|AI/i').count();
        ctx.log(`AI recommendations section found: ${aiSection > 0}`);

        // Accept/Reject buttons for recommendations
        const actionBtns = await ctx.page.locator('button, [role="button"]').filter({
          hasText: /Accepteer|Accept|Negeer|Reject|Dismiss/i,
        }).count();
        ctx.log(`Recommendation action buttons: ${actionBtns}`);
      },
    },
    {
      name: 'Navigate to AI Marketing page',
      action: async (ctx) => {
        const routes = ['/ai-marketing', '/ai', '/intelligence', '/intelligentie'];
        for (const route of routes) {
          await ctx.page.goto(`${ctx.app.baseUrl}${route}`);
          await ctx.page.waitForLoadState('networkidle');
          const body = (await ctx.page.textContent('body') || '').toLowerCase();
          if (body.length > 100 && !body.includes('404') && !body.includes('not found')) {
            ctx.log(`AI Marketing page loaded at ${route}`);
            ctx.data.aiRoute = route;
            return;
          }
        }

        // Try sidebar navigation
        const aiNav = ctx.page.locator('a, [role="menuitem"]').filter({ hasText: /AI Marketing|Intelligentie/i });
        if ((await aiNav.count()) > 0) {
          await aiNav.first().click();
          await ctx.page.waitForLoadState('networkidle');
          ctx.log('AI Marketing page via sidebar');
        } else {
          ctx.log('AI Marketing page not found');
        }
      },
    },
    {
      name: 'Check AI-powered insights and analytics',
      action: async (ctx) => {
        const insights = await ctx.page.locator(
          '[class*="insight"], [class*="recommendation"], [class*="ai-card"]'
        ).count();
        ctx.log(`AI insight elements: ${insights}`);

        const charts = await ctx.page.locator('canvas, svg, [class*="chart"]').count();
        ctx.log(`AI analytics charts: ${charts}`);
      },
    },
    {
      name: 'API - AI bot for marketing queries',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const chatRes = await ctx.api.post('/api/v1/bot/chats/', {
          title: 'Marketing AI Analysis',
        });
        if (chatRes.ok) {
          const msgRes = await ctx.api.post(`/api/v1/bot/chats/${chatRes.data.id}/send_message/`, {
            message: 'Analyze my email campaign performance and suggest improvements',
            language: 'en',
          });
          if (msgRes.ok) {
            ctx.log(`AI marketing analysis response: ${!!msgRes.data.ai_response}`);
          } else {
            ctx.log(`AI message returned ${msgRes.status}`);
          }
        }
      },
    },
  ],
};

export default scenario;
