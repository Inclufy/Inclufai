import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'ppmob-10-profile-settings',
  name: 'ProjeXtPal Mobile - Profile & Settings',
  app: 'projectpal_mobile',
  description: 'Test user profile viewing and settings management from mobile',
  tags: ['profile', 'settings', 'core'],
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
      name: 'API - Get user profile',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/users/me/');
        if (res.ok) {
          ctx.data.userId = res.data.id;
          ctx.data.originalProfile = {
            first_name: res.data.first_name,
            last_name: res.data.last_name,
          };
          const fields = Object.keys(res.data);
          ctx.log(`Profile loaded: ${res.data.email}, fields: ${fields.length}`);
          ctx.log(`Available fields: ${fields.slice(0, 15).join(', ')}`);
        } else {
          ctx.reportIssue({
            type: 'bug',
            severity: 'critical',
            title: 'Cannot load user profile from mobile',
            description: `GET /api/v1/users/me/ returned ${res.status}`,
            suggestion: 'Mobile profile screen requires this endpoint.',
          });
        }
      },
    },
    {
      name: 'API - Update profile (first name)',
      action: async (ctx) => {
        if (!ctx.data.userId) {
          ctx.log('No user ID, skipping');
          return;
        }
        const res = await ctx.api.patch('/api/v1/users/me/', {
          first_name: 'MobileUAT',
        });
        if (res.ok) {
          ctx.log(`Profile updated: first_name -> MobileUAT`);
        } else {
          ctx.log(`Profile update -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Revert profile',
      action: async (ctx) => {
        if (!ctx.data.originalProfile) {
          ctx.log('No original profile to revert');
          return;
        }
        const res = await ctx.api.patch('/api/v1/users/me/', {
          first_name: ctx.data.originalProfile.first_name || '',
        });
        ctx.log(`Profile reverted -> ${res.status}`);
      },
    },
    {
      name: 'API - List team members',
      action: async (ctx) => {
        const endpoints = ['/api/v1/users/', '/api/v1/teams/', '/api/v1/team/members/'];
        for (const ep of endpoints) {
          const res = await ctx.api.get(ep);
          if (res.ok) {
            const items = Array.isArray(res.data) ? res.data : res.data.results || [];
            ctx.log(`Team/Users (${ep}): ${items.length} members`);
            return;
          }
        }
        ctx.log('No team/users endpoint responded');
      },
    },
    {
      name: 'API - Subscriptions info',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/subscriptions/');
        if (res.ok) {
          const subs = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.log(`Subscriptions: ${subs.length}`);
        } else {
          ctx.log(`Subscriptions -> ${res.status}`);
        }
      },
    },
  ],
};

export default scenario;
