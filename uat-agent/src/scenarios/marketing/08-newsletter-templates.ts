import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mkt-08-newsletter-templates',
  name: 'Marketing - Newsletter Templates',
  app: 'marketing',
  description: 'Test newsletter template management and template selection',
  tags: ['templates', 'email', 'core'],
  steps: [
    {
      name: 'Verify templates API endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/newsletters/templates/');
        if (res.ok) {
          const count = Array.isArray(res.data) ? res.data.length : res.data?.results?.length || 0;
          ctx.log(`Templates API: OK (${count} templates found)`);
          ctx.data.templateCount = count;
        } else {
          ctx.reportIssue({
            type: 'bug',
            severity: 'major',
            title: 'Newsletter templates API not responding',
            description: `GET /api/v1/newsletters/templates/ returned ${res.status}`,
            suggestion: 'Verify the templates endpoint is registered and accessible.',
          });
        }
      },
    },
    {
      name: 'Navigate to templates page',
      action: async (ctx) => {
        const routes = ['/templates', '/newsletter-templates', '/email-templates'];
        for (const route of routes) {
          await ctx.page.goto(`${ctx.app.baseUrl}${route}`);
          await ctx.page.waitForLoadState('networkidle');
          const body = (await ctx.page.textContent('body') || '').toLowerCase();
          if (body.length > 100 && !body.includes('404') && !body.includes('not found')) {
            ctx.log(`Templates page loaded at ${route}`);
            return;
          }
        }
        ctx.log('Templates page not found at common routes - templates may be inline in newsletter creation');
      },
    },
    {
      name: 'Check template data structure',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/newsletters/templates/');
        if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
          const template = res.data[0];
          const fields = ['name', 'subject_template', 'is_default'];
          const found = fields.filter(f => f in template);
          ctx.log(`Template fields present: ${found.join(', ')}`);
        } else if (res.ok && res.data?.results?.length > 0) {
          const template = res.data.results[0];
          const fields = ['name', 'subject_template', 'is_default'];
          const found = fields.filter(f => f in template);
          ctx.log(`Template fields present: ${found.join(', ')}`);
        } else {
          ctx.log('No templates available to inspect structure');
        }
      },
    },
  ],
};

export default scenario;
