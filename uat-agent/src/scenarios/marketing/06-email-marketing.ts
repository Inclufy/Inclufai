import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mkt-06-email-marketing',
  name: 'Marketing - Email Marketing & Newsletters',
  app: 'marketing',
  description: 'Test newsletter creation, sending, and email marketing workflows',
  tags: ['email', 'newsletters', 'core', 'crud'],
  steps: [
    {
      name: 'Navigate to newsletters page',
      action: async (ctx) => {
        const routes = [
          '/newsletters',
          '/email-marketing',
          '/projects/1/execution/communication/newsletters',
        ];
        for (const route of routes) {
          await ctx.page.goto(`${ctx.app.baseUrl}${route}`);
          await ctx.page.waitForLoadState('networkidle');
          const body = (await ctx.page.textContent('body') || '').toLowerCase();
          if (body.length > 100 && !body.includes('404') && !body.includes('not found')) {
            ctx.log(`Newsletters page loaded at ${route}`);
            ctx.data.newsletterRoute = route;
            return;
          }
        }
        ctx.reportIssue({
          type: 'missing_feature',
          severity: 'major',
          title: 'Newsletters page not found',
          description: 'Could not find newsletters page at any common route',
          suggestion: 'Verify newsletter routes are configured in the application router.',
        });
      },
    },
    {
      name: 'Check newsletter list display',
      action: async (ctx) => {
        const hasTable = await ctx.page.locator('table, [role="table"]').count();
        const hasCards = await ctx.page.locator('[class*="card"], [class*="list"], [class*="grid"]').count();
        if (hasTable > 0 || hasCards > 0) {
          ctx.log(`Newsletter list elements found: tables=${hasTable}, cards/lists=${hasCards}`);
        } else {
          ctx.reportIssue({
            type: 'ui_issue',
            severity: 'minor',
            title: 'Newsletter list not rendered',
            description: 'No table or card elements found on newsletters page',
            suggestion: 'Check that newsletter data is being fetched and rendered.',
          });
        }
      },
    },
    {
      name: 'Check create newsletter button',
      action: async (ctx) => {
        const createBtn = ctx.page.locator('button, a').filter({ hasText: /create|new|add|compose/i });
        const count = await createBtn.count();
        if (count > 0) {
          ctx.log(`Create newsletter button found (${count} matches)`);
        } else {
          ctx.reportIssue({
            type: 'missing_feature',
            severity: 'major',
            title: 'Create newsletter button missing',
            description: 'No create/new/add newsletter button found on the page',
            suggestion: 'Add a visible button for creating new newsletters.',
          });
        }
      },
    },
    {
      name: 'Check newsletter table columns',
      action: async (ctx) => {
        const body = (await ctx.page.textContent('body') || '').toLowerCase();
        const expectedColumns = ['subject', 'recipients', 'status', 'date'];
        const found = expectedColumns.filter(col => body.includes(col));
        const missing = expectedColumns.filter(col => !body.includes(col));
        ctx.log(`Newsletter columns found: ${found.join(', ') || 'none'}`);
        if (missing.length > 0) {
          ctx.reportIssue({
            type: 'ui_issue',
            severity: 'minor',
            title: 'Newsletter table missing columns',
            description: `Missing expected columns: ${missing.join(', ')}`,
            suggestion: 'Ensure all newsletter columns (subject, recipients, status, date) are displayed.',
          });
        }
      },
    },
    {
      name: 'Check newsletter status badges',
      action: async (ctx) => {
        const badges = await ctx.page.locator('[class*="badge"], [class*="chip"], [class*="tag"]').count();
        ctx.log(`Status badges/chips found: ${badges}`);
      },
    },
  ],
};

export default scenario;
