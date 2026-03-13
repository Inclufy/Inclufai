import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'mob-03-notifications',
  name: 'Mobile - Notifications & Chat',
  app: 'mobile',
  description: 'Test notification and chat endpoints used by mobile push notifications and messaging',
  tags: ['notifications', 'chat', 'core'],
  steps: [
    {
      name: 'Bot/Chat endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/bot/chats/');
        if (res.ok) {
          const chats = Array.isArray(res.data) ? res.data : res.data?.results || [];
          ctx.log(`Bot chats: ${chats.length} found`);
        } else {
          ctx.log(`Bot chats endpoint: ${res.status}`);
        }
      },
    },
    {
      name: 'Surveys endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/surveys/');
        ctx.log(`Surveys endpoint: ${res.status} (${res.ok ? 'OK' : 'FAIL'})`);
      },
    },
    {
      name: 'Subscriptions endpoint',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/subscriptions/');
        ctx.log(`Subscriptions endpoint: ${res.status} (${res.ok ? 'OK' : 'FAIL'})`);
      },
    },
  ],
};

export default scenario;
