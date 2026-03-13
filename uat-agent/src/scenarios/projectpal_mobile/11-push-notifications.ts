import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'ppmob-11-push-notifications',
  name: 'ProjeXtPal Mobile - Push Notifications',
  app: 'projectpal_mobile',
  description: 'Test push notification endpoints, device token registration, and notification preferences',
  tags: ['notifications', 'push', 'mobile-specific', 'core'],
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
      name: 'API - Register push token (Expo)',
      action: async (ctx) => {
        const endpoints = [
          '/api/v1/devices/',
          '/api/v1/push/register/',
          '/api/v1/notifications/register-device/',
          '/api/v1/users/devices/',
        ];
        for (const ep of endpoints) {
          const res = await ctx.api.post(ep, {
            token: 'ExponentPushToken[UAT-test-token-000]',
            type: 'expo',
            platform: 'android',
            device_name: 'UAT Test Device',
          });
          if (res.ok || res.status === 201) {
            ctx.data.deviceEndpoint = ep;
            ctx.log(`Push token registered via ${ep}`);
            return;
          }
          if (res.status !== 404) {
            ctx.log(`POST ${ep} -> ${res.status}`);
          }
        }
        ctx.log('No push token registration endpoint found (may not be implemented yet)');
      },
    },
    {
      name: 'API - List registered devices',
      action: async (ctx) => {
        const endpoints = ['/api/v1/devices/', '/api/v1/users/devices/', '/api/v1/push/devices/'];
        for (const ep of endpoints) {
          const res = await ctx.api.get(ep);
          if (res.ok) {
            const devices = Array.isArray(res.data) ? res.data : res.data.results || [];
            ctx.log(`Registered devices (${ep}): ${devices.length}`);
            return;
          }
        }
        ctx.log('No device listing endpoint found');
      },
    },
    {
      name: 'API - List notifications',
      action: async (ctx) => {
        const endpoints = ['/api/v1/notifications/', '/api/v1/users/notifications/'];
        for (const ep of endpoints) {
          const res = await ctx.api.get(ep);
          if (res.ok) {
            const items = Array.isArray(res.data) ? res.data : res.data.results || [];
            const unread = items.filter((n: any) => !n.read && !n.is_read).length;
            ctx.log(`Notifications: ${items.length} total, ${unread} unread`);
            if (items.length > 0) {
              ctx.data.notificationId = items[0].id;
            }
            return;
          }
        }
        ctx.log('No notification listing endpoint found');
      },
    },
    {
      name: 'API - Mark notification as read',
      action: async (ctx) => {
        if (!ctx.data.notificationId) {
          ctx.log('No notification to mark, skipping');
          return;
        }
        const endpoints = [
          `/api/v1/notifications/${ctx.data.notificationId}/read/`,
          `/api/v1/notifications/${ctx.data.notificationId}/`,
        ];
        for (const ep of endpoints) {
          const res = ep.includes('/read/')
            ? await ctx.api.post(ep, {})
            : await ctx.api.patch(ep, { read: true, is_read: true });
          if (res.ok) {
            ctx.log(`Notification marked as read via ${ep}`);
            return;
          }
        }
        ctx.log('Could not mark notification as read');
      },
    },
    {
      name: 'API - Get notification preferences',
      action: async (ctx) => {
        const endpoints = [
          '/api/v1/notifications/preferences/',
          '/api/v1/users/notification-settings/',
          '/api/v1/users/me/',
        ];
        for (const ep of endpoints) {
          const res = await ctx.api.get(ep);
          if (res.ok) {
            ctx.log(`Notification preferences available at ${ep}`);
            if (res.data.notification_preferences || res.data.push_enabled !== undefined) {
              ctx.log(`Push preferences found in response`);
            }
            return;
          }
        }
        ctx.log('No notification preferences endpoint found');
      },
    },
  ],
};

export default scenario;
