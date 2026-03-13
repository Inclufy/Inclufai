import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'ppmob-13-user-features',
  name: 'ProjeXtPal Mobile - User Features & Subscription Tiers',
  app: 'projectpal_mobile',
  description: 'Test mobile-specific user feature flags, subscription tier access, and usage limits',
  tags: ['features', 'subscription', 'mobile-specific', 'critical'],
  steps: [
    {
      name: 'Login via API',
      action: async (ctx) => {
        const loginPaths = ['/api/v1/auth/login/', '/api/auth/login/'];
        for (const path of loginPaths) {
          const res = await ctx.api.post(path, {
            email: ctx.app.credentials.email,
            password: ctx.app.credentials.password,
          });
          if (res.ok) {
            const token = res.data.access || res.data.token || res.data.key;
            if (token) {
              ctx.api.setToken(token);
              ctx.log(`Login successful via ${path}`);
              return;
            }
          }
        }
        throw new Error('ProjeXtPal Mobile login failed');
      },
    },
    {
      name: 'API - Get user features and tier',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/auth/user-features/');
        if (res.ok) {
          ctx.data.userFeatures = res.data;
          const tier = res.data.tier || 'unknown';
          const features = res.data.features || {};
          ctx.log(`Tier: ${tier}`);
          ctx.log(`Mobile access: ${features.mobile_access}`);
          ctx.log(`Web access: ${features.web_access}`);
          ctx.log(`AI assistant: ${features.ai_assistant}`);

          // Mobile-only tiers (trial, starter) should have mobile_access=true, web_access=false
          if (features.mobile_access === false) {
            ctx.reportIssue({
              type: 'bug',
              severity: 'critical',
              title: 'Mobile access disabled for mobile app user',
              description: `User tier "${tier}" has mobile_access=false`,
              suggestion: 'Ensure the test user has a tier that allows mobile access.',
            });
          }
        } else {
          ctx.log(`User features endpoint -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Check usage limits',
      action: async (ctx) => {
        if (!ctx.data.userFeatures) {
          ctx.log('No user features data, skipping');
          return;
        }
        const limits = ctx.data.userFeatures.limits || {};
        const usage = ctx.data.userFeatures.usage || {};
        ctx.log(`Projects: ${usage.projects || 0} / ${limits.max_projects === -1 ? 'unlimited' : limits.max_projects}`);
        ctx.log(`Users: ${usage.users || 0} / ${limits.max_users === -1 ? 'unlimited' : limits.max_users}`);
        ctx.log(`Programs: ${usage.programs || 0} / ${limits.max_programs === -1 ? 'unlimited' : limits.max_programs}`);

        // Verify limits are not exceeded
        if (limits.max_projects > 0 && (usage.projects || 0) > limits.max_projects) {
          ctx.reportIssue({
            type: 'bug',
            severity: 'major',
            title: 'Project usage exceeds tier limit',
            description: `Usage ${usage.projects} exceeds limit ${limits.max_projects}`,
          });
        }
      },
    },
    {
      name: 'API - Verify feature-gated endpoints respond correctly',
      action: async (ctx) => {
        const features = ctx.data.userFeatures?.features || {};

        // Test time tracking if available in tier
        if (features.time_tracking) {
          const res = await ctx.api.get('/api/v1/projects/time-entries/');
          ctx.log(`Time tracking endpoint: ${res.status} (feature enabled: true)`);
        }

        // Test gantt if available
        if (features.gantt_charts) {
          const res = await ctx.api.get('/api/v1/projects/gantt/');
          ctx.log(`Gantt endpoint: ${res.status} (feature enabled: true)`);
        }

        // Test team features if available
        if (features.teams) {
          const res = await ctx.api.get('/api/v1/teams/');
          ctx.log(`Teams endpoint: ${res.status} (feature enabled: true)`);
        }

        ctx.log('Feature-gated endpoint checks complete');
      },
    },
    {
      name: 'API - Check subscription details',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/subscriptions/');
        if (res.ok) {
          const subs = Array.isArray(res.data) ? res.data : res.data.results || [res.data];
          for (const sub of subs.slice(0, 3)) {
            ctx.log(`Subscription: ${sub.plan || sub.tier || sub.name || 'unknown'}, status: ${sub.status || 'active'}`);
          }
        } else {
          ctx.log(`Subscriptions -> ${res.status}`);
        }
      },
    },
  ],
};

export default scenario;
