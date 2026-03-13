import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'finmob-01-login',
  name: 'Finance Mobile - Login',
  app: 'finance_mobile',
  description: 'Authenticate to the Finance app from a mobile context',
  tags: ['auth', 'smoke', 'critical'],
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
              ctx.log(`Finance Mobile login successful via ${path}`);
              return;
            }
          }
        }
        throw new Error('Finance Mobile login failed on all paths');
      },
    },
    {
      name: 'Get user profile',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/users/me/');
        ctx.log(`GET /api/v1/users/me/ -> ${res.status}`);
        if (res.ok && res.data.email) {
          ctx.log(`Logged in as: ${res.data.email}`);
        }
      },
    },
  ],
};

export default scenario;
