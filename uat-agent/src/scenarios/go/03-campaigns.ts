import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'go-03-campaigns',
  name: 'Inclufy GO - Campaigns',
  app: 'go',
  description: 'Test campaign listing, creation, and management in the GO mobile marketing app',
  tags: ['campaigns', 'crud', 'core'],
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
      name: 'Navigate to campaigns via bottom nav',
      action: async (ctx) => {
        const campaignsNav = ctx.page.locator('text=/Campagnes|Campaigns/i').first();
        if ((await campaignsNav.count()) > 0) {
          await campaignsNav.click();
          await ctx.page.waitForLoadState('networkidle');
          ctx.log('Navigated to campaigns via bottom nav');
        } else {
          await ctx.page.goto(`${ctx.app.baseUrl}/campaigns`);
          await ctx.page.waitForLoadState('networkidle');
          ctx.log('Navigated to campaigns directly');
        }
      },
    },
    {
      name: 'Check campaign list',
      action: async (ctx) => {
        const campaigns = await ctx.page.locator(
          '[class*="card"], [class*="campaign"], [class*="list-item"], table tr'
        ).count();
        ctx.log(`Campaign elements found: ${campaigns}`);

        // Check for campaign status indicators
        const statusBadges = await ctx.page.locator(
          '[class*="badge"], [class*="status"], [class*="chip"]'
        ).count();
        ctx.log(`Campaign status badges: ${statusBadges}`);
      },
    },
    {
      name: 'Check create campaign flow',
      action: async (ctx) => {
        const createBtn = ctx.page.locator('button, a, [role="button"]').filter({
          hasText: /create|nieuw|aanmaken|new/i,
        });
        const count = await createBtn.count();
        ctx.log(`Create campaign buttons: ${count}`);

        if (count > 0) {
          await createBtn.first().click();
          await ctx.page.waitForTimeout(1000);

          // Check for campaign creation form
          const formInputs = await ctx.page.locator('input, textarea, select').count();
          ctx.log(`Campaign form inputs: ${formInputs}`);

          // Close/go back
          const backBtn = ctx.page.locator('button[aria-label*="back" i], button[aria-label*="close" i], button[aria-label*="terug" i]');
          if ((await backBtn.count()) > 0) {
            await backBtn.first().click();
          } else {
            await ctx.page.goBack();
          }
        }
      },
    },
    {
      name: 'API - List campaigns/newsletters',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const endpoints = [
          '/api/v1/newsletters/newsletters/',
          '/api/v1/campaigns/',
        ];
        for (const ep of endpoints) {
          const res = await ctx.api.get(ep);
          ctx.log(`GET ${ep} -> ${res.status}`);
          if (res.ok) {
            const items = Array.isArray(res.data) ? res.data : res.data.results || [];
            ctx.log(`  Items: ${items.length}`);
          }
        }
      },
    },
  ],
};

export default scenario;
