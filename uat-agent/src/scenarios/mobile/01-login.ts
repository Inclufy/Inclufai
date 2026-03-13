import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mob-01-login',
  name: 'Mobile - Login Authentication',
  app: 'mobile',
  description: 'Test mobile app login flow via API authentication',
  tags: ['auth', 'smoke', 'critical'],
  steps: [
    {
      name: 'Health check endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/health/');
        if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
        ctx.log(`Health: OK (${res.status})`);
      },
    },
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
              ctx.data.token = token;
              ctx.log(`API login successful via ${path}`);
              return;
            }
          }
        }
        throw new Error('Mobile login failed: could not authenticate via any login path');
      },
    },
    {
      name: 'Get current user profile',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/users/me/');
        if (res.ok) {
          ctx.log(`User profile: ${res.data.email || res.data.username || 'loaded'}`);
          ctx.data.userId = res.data.id;
        } else {
          ctx.reportIssue({
            type: 'bug',
            severity: 'critical',
            title: 'User profile endpoint not responding',
            description: `GET /api/v1/users/me/ returned ${res.status}`,
            suggestion: 'Mobile app requires user profile endpoint for initial setup.',
          });
        }
      },
    },
  ],
};

export default scenario;
