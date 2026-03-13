import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'go-04-content-hub',
  name: 'Inclufy GO - Content Hub',
  app: 'go',
  description: 'Test the Content Hub for creating and managing marketing content',
  tags: ['content', 'crud', 'core'],
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
      name: 'Navigate to Content Hub',
      action: async (ctx) => {
        const contentNav = ctx.page.locator('text=/Content Hub|Content/i').first();
        if ((await contentNav.count()) > 0) {
          await contentNav.click();
          await ctx.page.waitForLoadState('networkidle');
          ctx.log('Navigated to Content Hub via sidebar');
        } else {
          // Try direct routes
          const routes = ['/content-hub', '/content', '/marketing/content'];
          for (const route of routes) {
            await ctx.page.goto(`${ctx.app.baseUrl}${route}`);
            await ctx.page.waitForLoadState('networkidle');
            const body = (await ctx.page.textContent('body') || '').toLowerCase();
            if (body.length > 100 && !body.includes('404')) {
              ctx.log(`Content Hub loaded at ${route}`);
              return;
            }
          }
          ctx.log('Content Hub route not found, checking sidebar navigation');
        }
      },
    },
    {
      name: 'Check content list and types',
      action: async (ctx) => {
        const contentItems = await ctx.page.locator(
          '[class*="card"], [class*="content-item"], [class*="list-item"]'
        ).count();
        ctx.log(`Content items found: ${contentItems}`);

        // Check for content type filters
        const filters = await ctx.page.locator(
          '[class*="filter"], [class*="tab"], [role="tab"]'
        ).count();
        ctx.log(`Content filters/tabs: ${filters}`);

        // Check for AI content generation
        const aiBtn = ctx.page.locator('button, [role="button"]').filter({
          hasText: /AI|generate|genereer/i,
        });
        const aiCount = await aiBtn.count();
        ctx.log(`AI generate buttons: ${aiCount}`);
      },
    },
    {
      name: 'Check create content button',
      action: async (ctx) => {
        const createBtn = ctx.page.locator('button, a, [role="button"]').filter({
          hasText: /create|nieuw|aanmaken|new|toevoegen/i,
        });
        const count = await createBtn.count();
        ctx.log(`Create content buttons: ${count}`);

        if (count === 0) {
          ctx.reportIssue({
            type: 'missing_feature',
            severity: 'major',
            title: 'No create content button found',
            description: 'Expected a button to create new content in the Content Hub',
          });
        }
      },
    },
  ],
};

export default scenario;
