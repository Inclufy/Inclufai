import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'pp-16-role-dashboards',
  name: 'ProjeXtPal - Role-Based Dashboards',
  app: 'projectpal',
  description: 'Test executive, project manager, program manager, team member, and methodology-specific dashboards',
  tags: ['dashboard', 'role-based', 'ui', 'core'],
  steps: [
    {
      name: 'Login and authenticate',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/login`);
        await ctx.page.fill('input[type="email"]', ctx.app.credentials.email);
        await ctx.page.fill('input[type="password"]', ctx.app.credentials.password);
        await ctx.page.click('button[type="submit"]');
        await ctx.page.waitForURL(/dashboard|projects/, { timeout: 15000 });
        ctx.log('Logged in successfully');
      },
    },
    {
      name: 'Check main dashboard loads with role-specific content',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/dashboard`);
        await ctx.page.waitForLoadState('networkidle');

        // Check for dashboard widgets/cards
        const widgets = await ctx.page.locator('[class*="widget"], [class*="card"], [class*="stat"], [class*="metric"]').count();
        ctx.log(`Dashboard widgets/cards found: ${widgets}`);

        // Check for role-specific elements
        const roleIndicators = await ctx.page.locator(
          'text=/executive|project manager|program manager|team member|admin/i'
        ).count();
        ctx.log(`Role indicator elements: ${roleIndicators}`);
      },
    },
    {
      name: 'Check dashboard has charts/visualizations',
      action: async (ctx) => {
        const charts = await ctx.page.locator(
          'canvas, svg[class*="chart"], [class*="chart"], [class*="graph"], [class*="recharts"]'
        ).count();
        ctx.log(`Chart/visualization elements found: ${charts}`);
      },
    },
    {
      name: 'Check dashboard has quick actions',
      action: async (ctx) => {
        const quickActions = await ctx.page.locator(
          '[class*="quick-action"], [class*="quickAction"], button[class*="action"]'
        ).count();
        const actionButtons = await ctx.page.locator('button, a').filter({
          hasText: /create project|new task|start timer|view reports/i,
        }).count();
        ctx.log(`Quick action elements: ${quickActions}, Action buttons: ${actionButtons}`);
      },
    },
    {
      name: 'Check dashboard navigation sidebar',
      action: async (ctx) => {
        const navItems = await ctx.page.locator(
          'nav a, [class*="sidebar"] a, [class*="nav"] a, [role="navigation"] a'
        ).count();
        ctx.log(`Navigation links found: ${navItems}`);

        // Check for key navigation items
        const keyPages = ['projects', 'programs', 'governance', 'academy', 'reports'];
        for (const page of keyPages) {
          const found = await ctx.page.locator(`nav a, [class*="sidebar"] a, [class*="nav"] a`).filter({
            hasText: new RegExp(page, 'i'),
          }).count();
          ctx.log(`Nav item '${page}': ${found > 0 ? 'found' : 'missing'}`);
        }
      },
    },
    {
      name: 'Check project-level Scrum dashboard',
      action: async (ctx) => {
        // Get a project ID
        const token = await ctx.page.evaluate(() => {
          return localStorage.getItem('token') || localStorage.getItem('access_token') || '';
        });
        if (token) ctx.api.setToken(token);

        const projRes = await ctx.api.get('/api/v1/projects/');
        if (projRes.ok) {
          const projects = Array.isArray(projRes.data) ? projRes.data : projRes.data.results || [];
          const scrumProject = projects.find((p: any) =>
            p.methodology === 'scrum' || p.methodology === 'agile'
          ) || projects[0];

          if (scrumProject) {
            await ctx.page.goto(`${ctx.app.baseUrl}/projects/${scrumProject.id}/scrum/overview`);
            await ctx.page.waitForLoadState('networkidle');
            const content = await ctx.page.locator('h1, h2, [class*="title"]').first().textContent();
            ctx.log(`Scrum dashboard loaded: ${content}`);
          } else {
            ctx.log('No projects available for methodology dashboard check');
          }
        }
      },
    },
    {
      name: 'Check project-level Kanban dashboard',
      action: async (ctx) => {
        const projRes = await ctx.api.get('/api/v1/projects/');
        if (projRes.ok) {
          const projects = Array.isArray(projRes.data) ? projRes.data : projRes.data.results || [];
          const kanbanProject = projects.find((p: any) => p.methodology === 'kanban') || projects[0];

          if (kanbanProject) {
            await ctx.page.goto(`${ctx.app.baseUrl}/projects/${kanbanProject.id}/kanban/overview`);
            await ctx.page.waitForLoadState('networkidle');
            const content = await ctx.page.locator('h1, h2, [class*="title"]').first().textContent();
            ctx.log(`Kanban dashboard loaded: ${content}`);
          }
        }
      },
    },
    {
      name: 'Check project-level PRINCE2 dashboard',
      action: async (ctx) => {
        const projRes = await ctx.api.get('/api/v1/projects/');
        if (projRes.ok) {
          const projects = Array.isArray(projRes.data) ? projRes.data : projRes.data.results || [];
          const prince2Project = projects.find((p: any) => p.methodology === 'prince2') || projects[0];

          if (prince2Project) {
            await ctx.page.goto(`${ctx.app.baseUrl}/projects/${prince2Project.id}/prince2/overview`);
            await ctx.page.waitForLoadState('networkidle');
            const content = await ctx.page.locator('h1, h2, [class*="title"]').first().textContent();
            ctx.log(`PRINCE2 dashboard loaded: ${content}`);
          }
        }
      },
    },
    {
      name: 'Check admin dashboard',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/admin`);
        await ctx.page.waitForLoadState('networkidle');

        const adminContent = await ctx.page.locator(
          '[class*="admin"], [class*="dashboard"], h1, h2'
        ).count();
        ctx.log(`Admin dashboard elements found: ${adminContent}`);

        // Check for admin-specific stats
        const stats = await ctx.page.locator(
          '[class*="stat"], [class*="metric"], [class*="count"]'
        ).count();
        ctx.log(`Admin stat widgets: ${stats}`);
      },
    },
  ],
};

export default scenario;
