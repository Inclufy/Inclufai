import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'ppmob-04-ai-chat',
  name: 'ProjeXtPal Mobile - AI Chat',
  app: 'projectpal_mobile',
  description: 'Test bot/AI chat features from mobile',
  tags: ['ai', 'chat', 'core'],
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
        ctx.log('Login: could not authenticate');
      },
    },
    {
      name: 'API - List chats',
      action: async (ctx) => {
        const res = await ctx.api.get('/api/v1/bot/chats/');
        if (res.ok) {
          const chats = Array.isArray(res.data) ? res.data : res.data.results || [];
          ctx.log(`Existing chats: ${chats.length}`);
        } else {
          ctx.log(`List chats -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Create new chat',
      action: async (ctx) => {
        const res = await ctx.api.post('/api/v1/bot/chats/', {
          title: 'ProjeXtPal Mobile UAT Chat',
        });
        if (res.ok) {
          ctx.data.chatId = res.data.id;
          ctx.log(`Chat created: ${res.data.id}`);
        } else {
          ctx.log(`Create chat -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Send message to AI',
      action: async (ctx) => {
        if (!ctx.data.chatId) {
          ctx.log('No chat created, skipping');
          return;
        }
        const res = await ctx.api.post(`/api/v1/bot/chats/${ctx.data.chatId}/send_message/`, {
          message: 'Show me my project summary',
          language: 'en',
        });
        if (res.ok) {
          ctx.log(`AI response received: ${!!res.data.ai_response}`);
        } else {
          ctx.log(`Send message -> ${res.status}`);
        }
      },
    },
    {
      name: 'API - Get chat history',
      action: async (ctx) => {
        if (!ctx.data.chatId) {
          ctx.log('No chat, skipping');
          return;
        }
        const res = await ctx.api.get(`/api/v1/bot/chats/${ctx.data.chatId}/`);
        ctx.log(`Chat detail -> ${res.status}`);
      },
    },
  ],
};

export default scenario;
