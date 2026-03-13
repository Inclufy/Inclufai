import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'ppmob-14-deep-linking',
  name: 'ProjeXtPal Mobile - Deep Linking & Auth Flows',
  app: 'projectpal_mobile',
  description: 'Test mobile deep link endpoints for email verification, password reset, and invitation flows',
  tags: ['auth', 'deep-linking', 'mobile-specific'],
  steps: [
    {
      name: 'API - Password reset request',
      action: async (ctx) => {
        const endpoints = [
          '/api/v1/auth/password/reset/',
          '/api/auth/password/reset/',
          '/api/v1/auth/forgot-password/',
        ];
        for (const ep of endpoints) {
          const res = await ctx.api.post(ep, {
            email: ctx.app.credentials.email,
          });
          if (res.ok || res.status === 200 || res.status === 204) {
            ctx.log(`Password reset triggered via ${ep} -> ${res.status}`);
            ctx.data.resetEndpoint = ep;
            return;
          }
          if (res.status !== 404) {
            ctx.log(`POST ${ep} -> ${res.status}`);
          }
        }
        ctx.log('No password reset endpoint found');
      },
    },
    {
      name: 'API - Verify password reset confirm endpoint exists',
      action: async (ctx) => {
        // Test that the confirm endpoint exists (with dummy token - expect 400, not 404)
        const endpoints = [
          '/api/v1/auth/password/reset/confirm/',
          '/api/auth/password/reset/confirm/',
          '/api/v1/auth/reset-password/',
        ];
        for (const ep of endpoints) {
          const res = await ctx.api.post(ep, {
            token: 'test-token-invalid',
            uid: 'test-uid',
            new_password1: 'DummyPass123!',
            new_password2: 'DummyPass123!',
          });
          // 400 = endpoint exists but token invalid (expected)
          // 404 = endpoint doesn't exist
          if (res.status !== 404) {
            ctx.log(`Password reset confirm endpoint found: ${ep} -> ${res.status}`);
            return;
          }
        }
        ctx.log('No password reset confirm endpoint found');
      },
    },
    {
      name: 'API - Verify email verification endpoint exists',
      action: async (ctx) => {
        const endpoints = [
          '/api/v1/auth/verify-email/',
          '/api/auth/verify-email/',
          '/api/v1/auth/registration/verify-email/',
        ];
        for (const ep of endpoints) {
          const res = await ctx.api.post(ep, {
            key: 'test-verification-key-invalid',
          });
          if (res.status !== 404) {
            ctx.log(`Email verification endpoint found: ${ep} -> ${res.status}`);
            return;
          }
        }
        ctx.log('No email verification endpoint found');
      },
    },
    {
      name: 'API - Login returns expected token structure',
      action: async (ctx) => {
        const res = await ctx.api.post('/api/v1/auth/login/', {
          email: ctx.app.credentials.email,
          password: ctx.app.credentials.password,
        });
        if (res.ok) {
          const fields = Object.keys(res.data);
          ctx.log(`Login response fields: ${fields.join(', ')}`);
          const hasAccessToken = !!res.data.access;
          const hasRefreshToken = !!res.data.refresh;
          const hasToken = !!res.data.token || !!res.data.key;
          ctx.log(`JWT pair: access=${hasAccessToken}, refresh=${hasRefreshToken}`);
          ctx.log(`Simple token: ${hasToken}`);

          if (hasAccessToken) {
            ctx.api.setToken(res.data.access);
          } else if (res.data.token || res.data.key) {
            ctx.api.setToken(res.data.token || res.data.key);
          }
        } else {
          ctx.log(`Login -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Token refresh (JWT)',
      action: async (ctx) => {
        // Try JWT refresh
        const loginRes = await ctx.api.post('/api/v1/auth/login/', {
          email: ctx.app.credentials.email,
          password: ctx.app.credentials.password,
        });
        if (!loginRes.ok || !loginRes.data.refresh) {
          ctx.log('No JWT refresh token available, skipping');
          return;
        }
        const endpoints = ['/api/v1/auth/token/refresh/', '/api/auth/token/refresh/'];
        for (const ep of endpoints) {
          const res = await ctx.api.post(ep, {
            refresh: loginRes.data.refresh,
          });
          if (res.ok) {
            ctx.log(`Token refresh via ${ep}: new access token received`);
            return;
          }
          if (res.status !== 404) {
            ctx.log(`POST ${ep} -> ${res.status}`);
          }
        }
        ctx.log('No token refresh endpoint found');
      },
    },
    {
      name: 'API - Check invitation endpoints',
      action: async (ctx) => {
        const endpoints = ['/api/v1/auth/invitations/', '/api/v1/invitations/'];
        for (const ep of endpoints) {
          const res = await ctx.api.get(ep);
          if (res.ok) {
            const items = Array.isArray(res.data) ? res.data : res.data.results || [];
            ctx.log(`Invitations (${ep}): ${items.length}`);
            return;
          }
          if (res.status !== 404) {
            ctx.log(`GET ${ep} -> ${res.status}`);
          }
        }
        ctx.log('No invitation listing endpoint found');
      },
    },
  ],
};

export default scenario;
