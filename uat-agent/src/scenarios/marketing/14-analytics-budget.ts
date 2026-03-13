import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mkt-14-analytics-budget',
  name: 'Marketing - Analytics & Budget',
  app: 'marketing',
  description: 'Test marketing analytics dashboards, budget tracking, opportunity feed, and networking engine',
  tags: ['analytics', 'budget', 'ui'],
  steps: [
    {
      name: 'Login',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/login`);
        await ctx.page.fill('input[type="email"], input[name="email"]', ctx.app.credentials.email);
        await ctx.page.fill('input[type="password"]', ctx.app.credentials.password);
        await ctx.page.click('button[type="submit"]');
        await ctx.page.waitForURL(/dashboard|home/, { timeout: 15000 });
        ctx.log('Logged in');
      },
    },
    {
      name: 'Check Marketing Budget page',
      action: async (ctx) => {
        const budgetNav = ctx.page.locator('a, [role="menuitem"]').filter({ hasText: /Marketing Budget|Budget/i });
        if ((await budgetNav.count()) > 0) {
          await budgetNav.first().click();
          await ctx.page.waitForLoadState('networkidle');

          const budgetCards = await ctx.page.locator('[class*="card"], [class*="stat"]').count();
          ctx.log(`Budget dashboard cards: ${budgetCards}`);

          const charts = await ctx.page.locator('canvas, svg, [class*="chart"]').count();
          ctx.log(`Budget charts: ${charts}`);
        } else {
          ctx.log('Marketing Budget page not found in navigation');
        }
      },
    },
    {
      name: 'Check Analyse (Analytics) page',
      action: async (ctx) => {
        const analyseNav = ctx.page.locator('a, [role="menuitem"]').filter({ hasText: /^Analyse$|^Analytics$/i });
        if ((await analyseNav.count()) > 0) {
          await analyseNav.first().click();
          await ctx.page.waitForLoadState('networkidle');

          const charts = await ctx.page.locator('canvas, svg, [class*="chart"], [class*="graph"]').count();
          ctx.log(`Analytics charts: ${charts}`);

          // Check for KPI metrics
          const kpis = await ctx.page.locator('[class*="kpi"], [class*="metric"], [class*="stat"]').count();
          ctx.log(`KPI/metric elements: ${kpis}`);

          // Check for date range selector
          const dateRange = await ctx.page.locator(
            '[class*="date-range"], [class*="period"], input[type="date"]'
          ).count();
          ctx.log(`Date range selector: ${dateRange > 0}`);
        } else {
          ctx.log('Analytics page not found in navigation');
        }
      },
    },
    {
      name: 'Check Opportunity Feed page',
      action: async (ctx) => {
        const oppNav = ctx.page.locator('a, [role="menuitem"]').filter({ hasText: /Opportunity|Kansen/i });
        if ((await oppNav.count()) > 0) {
          await oppNav.first().click();
          await ctx.page.waitForLoadState('networkidle');

          const feedItems = await ctx.page.locator('[class*="feed"], [class*="card"], [class*="opportunity"]').count();
          ctx.log(`Opportunity feed items: ${feedItems}`);
        } else {
          ctx.log('Opportunity Feed not found in navigation');
        }
      },
    },
    {
      name: 'Check Networking Engine page',
      action: async (ctx) => {
        const netNav = ctx.page.locator('a, [role="menuitem"]').filter({ hasText: /Networking/i });
        if ((await netNav.count()) > 0) {
          await netNav.first().click();
          await ctx.page.waitForLoadState('networkidle');

          const netContent = await ctx.page.locator('[class*="network"], [class*="connection"], [class*="card"]').count();
          ctx.log(`Networking content elements: ${netContent}`);
        } else {
          ctx.log('Networking Engine not found in navigation');
        }
      },
    },
    {
      name: 'Check Integraties (Integrations) page',
      action: async (ctx) => {
        const intNav = ctx.page.locator('a, [role="menuitem"]').filter({ hasText: /Integraties|Integrations/i });
        if ((await intNav.count()) > 0) {
          await intNav.first().click();
          await ctx.page.waitForLoadState('networkidle');

          const integrations = await ctx.page.locator('[class*="integration"], [class*="card"], [class*="connector"]').count();
          ctx.log(`Integration cards: ${integrations}`);

          // Check for connected/disconnected status
          const statusElements = await ctx.page.locator('[class*="status"], [class*="badge"]').count();
          ctx.log(`Integration status badges: ${statusElements}`);
        } else {
          ctx.log('Integrations page not found in navigation');
        }
      },
    },
  ],
};

export default scenario;
