import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'go-02-dashboard',
  name: 'Inclufy GO - Marketing Dashboard',
  app: 'go',
  description: 'Test the GO dashboard with marketing metrics, AI recommendations, quick actions, and bottom navigation',
  tags: ['dashboard', 'smoke', 'critical', 'ai'],
  steps: [
    {
      name: 'Login',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/login`);
        await ctx.page.fill('input[type="email"], input[name="email"]', ctx.app.credentials.email);
        await ctx.page.fill('input[type="password"]', ctx.app.credentials.password);
        await ctx.page.click('button[type="submit"], button:has-text("Inloggen"), button:has-text("Login")');
        await ctx.page.waitForURL(/dashboard|home|overzicht/, { timeout: 15000 });

        const token = await ctx.page.evaluate(() => {
          return localStorage.getItem('token') || localStorage.getItem('access_token') || '';
        });
        if (token) {
          ctx.api.setToken(token);
          ctx.data.authToken = token;
        }
        ctx.log('Logged in');
      },
    },
    {
      name: 'Verify dashboard welcome message',
      action: async (ctx) => {
        const welcome = await ctx.page.locator('text=/Welkom|Welcome/i').count();
        ctx.log(`Welcome message found: ${welcome > 0}`);

        const subtitle = await ctx.page.locator('text=/marketing overzicht|marketing overview/i').count();
        ctx.log(`Marketing overview subtitle: ${subtitle > 0}`);
      },
    },
    {
      name: 'Check marketing metric cards',
      action: async (ctx) => {
        // Check for key metrics from screenshot: Actieve Campagnes, Totaal Contacten, Open Rate, Omzet
        const metrics = [
          { nl: 'Actieve Campagnes', en: 'Active Campaigns' },
          { nl: 'Totaal Contacten', en: 'Total Contacts' },
          { nl: 'Open Rate', en: 'Open Rate' },
          { nl: 'Omzet', en: 'Revenue' },
        ];

        for (const metric of metrics) {
          const found = await ctx.page.locator(`text=/${metric.nl}|${metric.en}/i`).count();
          ctx.log(`Metric '${metric.nl}': ${found > 0 ? 'found' : 'missing'}`);
        }

        // Check for metric values (numbers, percentages, currency)
        const statCards = await ctx.page.locator('[class*="card"], [class*="stat"], [class*="metric"]').count();
        ctx.log(`Stat/metric card elements: ${statCards}`);
      },
    },
    {
      name: 'Check AI Recommendations section',
      action: async (ctx) => {
        // "AI Aanbevelingen" section from screenshot
        const aiSection = await ctx.page.locator('text=/AI Aanbevelingen|AI Recommendations/i').count();
        ctx.log(`AI Recommendations section: ${aiSection > 0}`);

        // Check for recommendation cards: Budget optimalisatie, Engagement piek, Nieuwe leads
        const recommendations = ['Budget', 'Engagement', 'leads'];
        for (const rec of recommendations) {
          const found = await ctx.page.locator(`text=/${rec}/i`).count();
          ctx.log(`AI recommendation '${rec}': ${found > 0 ? 'found' : 'not found'}`);
        }

        // Check for Accept/Reject buttons ("Accepteer" / "Negeer")
        const acceptBtns = await ctx.page.locator('button, [role="button"]').filter({
          hasText: /Accepteer|Accept/i,
        }).count();
        const rejectBtns = await ctx.page.locator('button, [role="button"]').filter({
          hasText: /Negeer|Reject|Dismiss/i,
        }).count();
        ctx.log(`Accept buttons: ${acceptBtns}, Reject buttons: ${rejectBtns}`);
      },
    },
    {
      name: 'Check Kansen Radar (Opportunity Radar)',
      action: async (ctx) => {
        const kansenRadar = await ctx.page.locator('text=/Kansen Radar|Opportunity Radar/i').count();
        ctx.log(`Kansen Radar section: ${kansenRadar > 0}`);

        if (kansenRadar > 0) {
          // Check for opportunity count
          const impactText = await ctx.page.locator('text=/impact|kansen/i').count();
          ctx.log(`Opportunity impact indicators: ${impactText}`);
        }
      },
    },
    {
      name: 'Check Marketing Automatisering section',
      action: async (ctx) => {
        const autoSection = await ctx.page.locator('text=/Marketing Automatisering|Marketing Automation/i').count();
        ctx.log(`Marketing Automation section: ${autoSection > 0}`);

        if (autoSection > 0) {
          const activeCount = await ctx.page.locator('text=/actieve|active/i').count();
          ctx.log(`Active automation indicators: ${activeCount}`);
        }
      },
    },
    {
      name: 'Check Quick Actions (Snelle acties)',
      action: async (ctx) => {
        const quickActions = await ctx.page.locator('text=/Snelle acties|Quick actions/i').count();
        ctx.log(`Quick actions section: ${quickActions > 0}`);

        // Check for action buttons: Campagne, Content, Lead, Budget
        const actions = ['Campagne', 'Content', 'Lead', 'Budget'];
        for (const action of actions) {
          const found = await ctx.page.locator(`text=/${action}/i`).count();
          ctx.log(`Quick action '${action}': ${found > 0 ? 'found' : 'missing'}`);
        }
      },
    },
    {
      name: 'Check bottom navigation',
      action: async (ctx) => {
        // Bottom nav: Home, Campagnes, Create, Events, AI
        const navItems = ['Home', 'Campagnes', 'Create', 'Events', 'AI'];
        for (const item of navItems) {
          const found = await ctx.page.locator(`text=/${item}/i`).count();
          ctx.log(`Bottom nav '${item}': ${found > 0 ? 'found' : 'missing'}`);
        }

        // Check for FAB (floating action button) for Create
        const fab = await ctx.page.locator('[class*="fab"], [class*="create-btn"], button[class*="round"]').count();
        ctx.log(`Create FAB button: ${fab > 0}`);
      },
    },
    {
      name: 'Check notification bell',
      action: async (ctx) => {
        const bell = await ctx.page.locator(
          'button[aria-label*="notification" i], button[aria-label*="melding" i], [class*="notification"], [class*="bell"]'
        ).count();
        ctx.log(`Notification bell: ${bell > 0}`);
      },
    },
    {
      name: 'Check settings gear icon',
      action: async (ctx) => {
        const settings = await ctx.page.locator(
          'button[aria-label*="settings" i], button[aria-label*="instelling" i], [class*="settings"], [class*="gear"]'
        ).count();
        ctx.log(`Settings icon: ${settings > 0}`);
      },
    },
  ],
};

export default scenario;
