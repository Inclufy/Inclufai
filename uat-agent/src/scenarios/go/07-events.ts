import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'go-07-events',
  name: 'Inclufy GO - Events',
  app: 'go',
  description: 'Test the Events section from the bottom navigation',
  tags: ['events', 'ui'],
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
      name: 'Navigate to Events via bottom nav',
      action: async (ctx) => {
        const eventsNav = ctx.page.locator('text=/Events/i').first();
        if ((await eventsNav.count()) > 0) {
          await eventsNav.click();
          await ctx.page.waitForLoadState('networkidle');
          ctx.log('Navigated to Events');
        } else {
          await ctx.page.goto(`${ctx.app.baseUrl}/events`);
          await ctx.page.waitForLoadState('networkidle');
          ctx.log('Navigated to Events directly');
        }
      },
    },
    {
      name: 'Check events list',
      action: async (ctx) => {
        const eventItems = await ctx.page.locator(
          '[class*="event"], [class*="card"], [class*="list-item"]'
        ).count();
        ctx.log(`Event items found: ${eventItems}`);

        // Check for calendar/date elements
        const dateElements = await ctx.page.locator(
          '[class*="calendar"], [class*="date"], time'
        ).count();
        ctx.log(`Date/calendar elements: ${dateElements}`);

        // Check for create event button
        const createBtn = ctx.page.locator('button, a').filter({
          hasText: /create|nieuw|aanmaken|add/i,
        });
        ctx.log(`Create event buttons: ${await createBtn.count()}`);
      },
    },
    {
      name: 'API - Communication meetings/events',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping');
          return;
        }
        const res = await ctx.api.get('/api/v1/communication/meetings/');
        ctx.log(`GET /api/v1/communication/meetings/ -> ${res.status}`);
        if (res.ok) {
          const items = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.log(`Meetings/events: ${items.length}`);
        }
      },
    },
  ],
};

export default scenario;
