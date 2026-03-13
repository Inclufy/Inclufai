import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'go-01-login',
  name: 'Inclufy GO - Login Authentication',
  app: 'go',
  description: 'Test Inclufy GO mobile marketing app login flow (Dutch UI)',
  tags: ['auth', 'smoke', 'critical'],
  steps: [
    {
      name: 'Navigate to login page',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/login`);
        await ctx.page.waitForLoadState('networkidle');
        ctx.log('Login page loaded');
      },
    },
    {
      name: 'Verify login page elements (Dutch UI)',
      action: async (ctx) => {
        // Check for Dutch login form elements
        const emailInput = await ctx.page.locator('input[type="email"], input[name="email"], input[placeholder*="mail" i]').count();
        const passwordInput = await ctx.page.locator('input[type="password"]').count();
        const loginBtn = await ctx.page.locator('button').filter({ hasText: /inloggen|login/i }).count();

        ctx.log(`Email input: ${emailInput > 0}, Password input: ${passwordInput > 0}, Login button: ${loginBtn > 0}`);

        // Check for Inclufy branding
        const branding = await ctx.page.locator('text=/Inclufy|AI MARKETING|on the go/i').count();
        ctx.log(`Inclufy branding elements: ${branding}`);

        // Check for "Account aanmaken" (Create account) link
        const createAccount = await ctx.page.locator('text=/Account aanmaken|registreren|sign up/i').count();
        ctx.log(`Create account link: ${createAccount > 0}`);

        // Check for "Vergeten?" (Forgot password) link
        const forgotPassword = await ctx.page.locator('text=/Vergeten|forgot|wachtwoord/i').count();
        ctx.log(`Forgot password link: ${forgotPassword > 0}`);
      },
    },
    {
      name: 'Submit login credentials',
      action: async (ctx) => {
        await ctx.page.fill('input[type="email"], input[name="email"]', ctx.app.credentials.email);
        await ctx.page.fill('input[type="password"]', ctx.app.credentials.password);
        ctx.log('Credentials entered');

        const loginBtn = ctx.page.locator('button').filter({ hasText: /inloggen|login/i });
        await loginBtn.click();
        await ctx.page.waitForURL(/dashboard|home|overzicht/, { timeout: 15000 });
        ctx.log(`Logged in, redirected to: ${ctx.page.url()}`);
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
              ctx.data.authToken = token;
              ctx.log(`API login successful via ${path}`);
              return;
            }
          }
        }
        ctx.log('API login: could not authenticate');
      },
    },
  ],
};

export default scenario;
