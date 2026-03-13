import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'go-08-sidebar-nav',
  name: 'Inclufy GO - Sidebar Navigation & Pages',
  app: 'go',
  description: 'Test all sidebar navigation items: Overzicht, AI Marketing, Budget, Integraties, Opportunity Feed, Configuratie, Analyse, Networking Engine',
  tags: ['navigation', 'ui', 'smoke'],
  steps: [
    {
      name: 'Login',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/login`);
        await ctx.page.fill('input[type="email"], input[name="email"]', ctx.app.credentials.email);
        await ctx.page.fill('input[type="password"]', ctx.app.credentials.password);
        await ctx.page.click('button[type="submit"], button:has-text("Inloggen"), button:has-text("Login")');
        await ctx.page.waitForURL(/dashboard|home/, { timeout: 15000 });
        ctx.log('Logged in');
      },
    },
    {
      name: 'Check Overzicht (Overview) page',
      action: async (ctx) => {
        const overzicht = ctx.page.locator('a, [role="menuitem"]').filter({ hasText: /^Overzicht$|^Overview$/i });
        if ((await overzicht.count()) > 0) {
          await overzicht.first().click();
          await ctx.page.waitForLoadState('networkidle');
          ctx.log('Overzicht page loaded');
        }
      },
    },
    {
      name: 'Check Marketing Budget page',
      action: async (ctx) => {
        const budgetNav = ctx.page.locator('a, [role="menuitem"]').filter({ hasText: /Marketing Budget|Budget/i });
        if ((await budgetNav.count()) > 0) {
          await budgetNav.first().click();
          await ctx.page.waitForLoadState('networkidle');

          const budgetElements = await ctx.page.locator(
            '[class*="budget"], [class*="chart"], [class*="card"], canvas, svg'
          ).count();
          ctx.log(`Marketing Budget elements: ${budgetElements}`);

          // Check for budget figures (€ or numbers)
          const hasCurrency = await ctx.page.locator('text=/€|EUR/').count();
          ctx.log(`Currency indicators: ${hasCurrency}`);
        } else {
          ctx.log('Marketing Budget nav item not found');
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

          const integrations = await ctx.page.locator(
            '[class*="integration"], [class*="card"], [class*="connector"]'
          ).count();
          ctx.log(`Integration elements: ${integrations}`);
        } else {
          ctx.log('Integrations nav item not found');
        }
      },
    },
    {
      name: 'Check Opportunity Feed page',
      action: async (ctx) => {
        const oppNav = ctx.page.locator('a, [role="menuitem"]').filter({ hasText: /Opportunity Feed|Opportunity/i });
        if ((await oppNav.count()) > 0) {
          await oppNav.first().click();
          await ctx.page.waitForLoadState('networkidle');

          const oppItems = await ctx.page.locator(
            '[class*="opportunity"], [class*="card"], [class*="feed-item"]'
          ).count();
          ctx.log(`Opportunity feed items: ${oppItems}`);
        } else {
          ctx.log('Opportunity Feed nav item not found');
        }
      },
    },
    {
      name: 'Check Configuratie (Configuration) page',
      action: async (ctx) => {
        const configNav = ctx.page.locator('a, [role="menuitem"]').filter({ hasText: /Configuratie|Configuration|Settings/i });
        if ((await configNav.count()) > 0) {
          await configNav.first().click();
          await ctx.page.waitForLoadState('networkidle');

          const configItems = await ctx.page.locator('input, select, [class*="setting"]').count();
          ctx.log(`Configuration form elements: ${configItems}`);
        } else {
          ctx.log('Configuration nav item not found');
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
          ctx.log(`Analytics chart elements: ${charts}`);

          const metrics = await ctx.page.locator('[class*="metric"], [class*="stat"], [class*="kpi"]').count();
          ctx.log(`Analytics metrics: ${metrics}`);
        } else {
          ctx.log('Analytics nav item not found');
        }
      },
    },
    {
      name: 'Check Networking Engine page',
      action: async (ctx) => {
        const netNav = ctx.page.locator('a, [role="menuitem"]').filter({ hasText: /Networking Engine|Networking/i });
        if ((await netNav.count()) > 0) {
          await netNav.first().click();
          await ctx.page.waitForLoadState('networkidle');

          const netElements = await ctx.page.locator(
            '[class*="network"], [class*="card"], [class*="connection"]'
          ).count();
          ctx.log(`Networking elements: ${netElements}`);
        } else {
          ctx.log('Networking Engine nav item not found');
        }
      },
    },
  ],
};

export default scenario;
