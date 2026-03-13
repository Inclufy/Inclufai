import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'pp-11-governance',
  name: 'ProjeXtPal - Governance Layer',
  app: 'projectpal',
  description: 'Test governance portfolios, boards, stakeholders CRUD and AI Smart Helper',
  tags: ['governance', 'crud', 'core', 'ai'],
  steps: [
    {
      name: 'Login and authenticate',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/login`);
        await ctx.page.fill('input[type="email"]', ctx.app.credentials.email);
        await ctx.page.fill('input[type="password"]', ctx.app.credentials.password);
        await ctx.page.click('button[type="submit"]');
        await ctx.page.waitForURL(/dashboard|projects/, { timeout: 15000 });

        const token = await ctx.page.evaluate(() => {
          return localStorage.getItem('token') || localStorage.getItem('access_token') || '';
        });
        if (token) {
          ctx.api.setToken(token);
          ctx.data.authToken = token;
        }
        ctx.log('Logged in successfully');
      },
    },
    {
      name: 'Navigate to portfolios page',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/governance/portfolios`);
        await ctx.page.waitForLoadState('networkidle');
        const heading = await ctx.page.locator('h1, h2, [class*="title"]').first().textContent();
        ctx.log(`Portfolios page loaded: ${heading}`);
      },
    },
    {
      name: 'Check portfolio list and create button',
      action: async (ctx) => {
        const listElements = await ctx.page.locator('table, [role="table"], [class*="list"], [class*="grid"], [class*="card"]').count();
        ctx.log(`Portfolio list/card elements found: ${listElements}`);

        const createBtn = ctx.page.locator('button, a').filter({ hasText: /create|new|add/i });
        const count = await createBtn.count();
        ctx.log(`Create portfolio buttons found: ${count}`);
        if (count === 0) {
          ctx.reportIssue({
            type: 'missing_feature',
            severity: 'major',
            title: 'No create portfolio button found',
            description: 'Expected a button to create new portfolios on the portfolios page',
          });
        }
      },
    },
    {
      name: 'Navigate to governance boards page',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/governance/boards`);
        await ctx.page.waitForLoadState('networkidle');
        const heading = await ctx.page.locator('h1, h2, [class*="title"]').first().textContent();
        ctx.log(`Governance boards page loaded: ${heading}`);
      },
    },
    {
      name: 'Check boards list and create button',
      action: async (ctx) => {
        const listElements = await ctx.page.locator('table, [role="table"], [class*="list"], [class*="grid"], [class*="card"]').count();
        ctx.log(`Board list/card elements found: ${listElements}`);

        const createBtn = ctx.page.locator('button, a').filter({ hasText: /create|new|add/i });
        const count = await createBtn.count();
        ctx.log(`Create board buttons found: ${count}`);
      },
    },
    {
      name: 'Navigate to governance stakeholders page',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/governance/stakeholders`);
        await ctx.page.waitForLoadState('networkidle');
        const heading = await ctx.page.locator('h1, h2, [class*="title"]').first().textContent();
        ctx.log(`Stakeholders page loaded: ${heading}`);
      },
    },
    {
      name: 'Check stakeholders list',
      action: async (ctx) => {
        const listElements = await ctx.page.locator('table, [role="table"], [class*="list"], [class*="grid"], [class*="card"]').count();
        ctx.log(`Stakeholder list/card elements found: ${listElements}`);
      },
    },
    {
      name: 'API - Portfolios CRUD',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping API test');
          return;
        }
        // List portfolios
        const listRes = await ctx.api.get('/api/v1/governance/portfolios/');
        ctx.log(`GET /api/v1/governance/portfolios/ -> ${listRes.status}`);

        // Create portfolio
        const createRes = await ctx.api.post('/api/v1/governance/portfolios/', {
          name: 'UAT Test Portfolio',
          description: 'Created by UAT agent',
          status: 'active',
        });
        if (createRes.ok) {
          ctx.data.portfolioId = createRes.data.id;
          ctx.log(`Portfolio created with ID: ${createRes.data.id}`);
        } else {
          ctx.log(`Create portfolio returned ${createRes.status}: ${JSON.stringify(createRes.data)}`);
        }
      },
    },
    {
      name: 'API - Governance Boards CRUD',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping API test');
          return;
        }
        const listRes = await ctx.api.get('/api/v1/governance/boards/');
        ctx.log(`GET /api/v1/governance/boards/ -> ${listRes.status}`);

        const createRes = await ctx.api.post('/api/v1/governance/boards/', {
          name: 'UAT Test Board',
          description: 'Created by UAT agent',
        });
        if (createRes.ok) {
          ctx.data.boardId = createRes.data.id;
          ctx.log(`Board created with ID: ${createRes.data.id}`);
        } else {
          ctx.log(`Create board returned ${createRes.status}: ${JSON.stringify(createRes.data)}`);
        }
      },
    },
    {
      name: 'API - Governance Stakeholders CRUD',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping API test');
          return;
        }
        const listRes = await ctx.api.get('/api/v1/governance/stakeholders/');
        ctx.log(`GET /api/v1/governance/stakeholders/ -> ${listRes.status}`);

        const createRes = await ctx.api.post('/api/v1/governance/stakeholders/', {
          name: 'UAT Test Stakeholder',
          role: 'sponsor',
          influence: 'high',
        });
        if (createRes.ok) {
          ctx.data.stakeholderId = createRes.data.id;
          ctx.log(`Stakeholder created with ID: ${createRes.data.id}`);
        } else {
          ctx.log(`Create stakeholder returned ${createRes.status}: ${JSON.stringify(createRes.data)}`);
        }
      },
    },
    {
      name: 'API - Board Members endpoint',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping API test');
          return;
        }
        const res = await ctx.api.get('/api/v1/governance/board-members/');
        ctx.log(`GET /api/v1/governance/board-members/ -> ${res.status}`);
      },
    },
    {
      name: 'API - AI Smart Helper generate',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping API test');
          return;
        }
        const res = await ctx.api.post('/api/v1/governance/ai/generate/', {
          prompt: 'Generate a sample portfolio description for a digital transformation initiative',
          type: 'portfolio',
        });
        if (res.ok) {
          const preview = typeof res.data === 'string'
            ? res.data.substring(0, 100)
            : JSON.stringify(res.data).substring(0, 100);
          ctx.log(`AI generate response: ${preview}...`);
        } else {
          ctx.log(`AI generate returned ${res.status}`);
        }
      },
    },
    {
      name: 'API - AI Report generation',
      action: async (ctx) => {
        if (!ctx.data.authToken) {
          ctx.log('No auth token, skipping API test');
          return;
        }
        const res = await ctx.api.post('/api/v1/governance/reports/generate/', {
          type: 'portfolio_analysis',
        });
        if (res.ok) {
          ctx.log(`Report generated successfully`);
        } else {
          ctx.log(`Report generation returned ${res.status}`);
        }
      },
    },
    {
      name: 'Cleanup - delete test data',
      action: async (ctx) => {
        if (ctx.data.portfolioId) {
          await ctx.api.delete(`/api/v1/governance/portfolios/${ctx.data.portfolioId}/`);
          ctx.log('Cleaned up test portfolio');
        }
        if (ctx.data.boardId) {
          await ctx.api.delete(`/api/v1/governance/boards/${ctx.data.boardId}/`);
          ctx.log('Cleaned up test board');
        }
        if (ctx.data.stakeholderId) {
          await ctx.api.delete(`/api/v1/governance/stakeholders/${ctx.data.stakeholderId}/`);
          ctx.log('Cleaned up test stakeholder');
        }
      },
    },
  ],
};

export default scenario;
