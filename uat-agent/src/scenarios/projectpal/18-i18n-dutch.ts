import type { Scenario } from '../../core/types.js';

const scenario: Scenario = {
  id: 'pp-18-i18n-dutch',
  name: 'ProjeXtPal - Dutch Language & i18n',
  app: 'projectpal',
  description: 'Test Dutch translations, language switching, and translation completeness across pages',
  tags: ['i18n', 'dutch', 'language', 'ui'],
  steps: [
    {
      name: 'Login and authenticate',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/login`);
        await ctx.page.fill('input[type="email"]', ctx.app.credentials.email);
        await ctx.page.fill('input[type="password"]', ctx.app.credentials.password);
        await ctx.page.click('button[type="submit"]');
        await ctx.page.waitForURL(/dashboard|projects/, { timeout: 15000 });
        ctx.log('Logged in successfully');
      },
    },
    {
      name: 'Check language switcher exists',
      action: async (ctx) => {
        const langSwitcher = await ctx.page.locator(
          'button[aria-label*="language" i], [class*="language" i], [class*="lang-switch" i], select[class*="lang" i], [data-testid*="lang" i]'
        ).count();
        ctx.log(`Language switcher elements found: ${langSwitcher}`);

        // Also check for language flags or codes
        const langIndicators = await ctx.page.locator('text=/EN|NL|🇳🇱|🇬🇧/').count();
        ctx.log(`Language indicator elements: ${langIndicators}`);

        if (langSwitcher === 0 && langIndicators === 0) {
          ctx.reportIssue({
            type: 'missing_feature',
            severity: 'major',
            title: 'No language switcher found',
            description: 'Expected a language switcher to toggle between English and Dutch',
          });
        }
      },
    },
    {
      name: 'Switch to Dutch language',
      action: async (ctx) => {
        // Try various approaches to switch language
        const langBtn = ctx.page.locator(
          'button[aria-label*="language" i], [class*="language" i], [class*="lang" i]'
        ).first();

        if ((await langBtn.count()) > 0) {
          await langBtn.click();
          await ctx.page.waitForTimeout(500);

          // Look for Dutch option
          const nlOption = ctx.page.locator('text=/Nederlands|Dutch|NL/i').first();
          if ((await nlOption.count()) > 0) {
            await nlOption.click();
            await ctx.page.waitForTimeout(1000);
            ctx.data.switchedToDutch = true;
            ctx.log('Switched to Dutch language');
          } else {
            ctx.log('Dutch language option not found in switcher');
          }
        } else {
          // Try setting language via localStorage or URL
          await ctx.page.evaluate(() => {
            localStorage.setItem('language', 'nl');
            localStorage.setItem('i18nextLng', 'nl');
          });
          await ctx.page.reload();
          await ctx.page.waitForLoadState('networkidle');
          ctx.data.switchedToDutch = true;
          ctx.log('Set Dutch language via localStorage');
        }
      },
    },
    {
      name: 'Verify dashboard is translated to Dutch',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/dashboard`);
        await ctx.page.waitForLoadState('networkidle');

        // Check for common Dutch words on dashboard
        const dutchTerms = ['projecten', 'taken', 'overzicht', 'dashboard', 'welkom', 'programma'];
        let dutchCount = 0;
        for (const term of dutchTerms) {
          const found = await ctx.page.locator(`text=/${term}/i`).count();
          if (found > 0) dutchCount++;
        }
        ctx.log(`Dutch terms found on dashboard: ${dutchCount}/${dutchTerms.length}`);

        // Check for untranslated English strings (potential translation gaps)
        const englishOnly = ['Welcome', 'Overview', 'Projects', 'Settings'];
        let untranslated = 0;
        for (const term of englishOnly) {
          const found = await ctx.page.locator(`text="${term}"`).count();
          if (found > 0) untranslated++;
        }
        if (untranslated > 0) {
          ctx.log(`Potentially untranslated English strings: ${untranslated}`);
          ctx.reportIssue({
            type: 'bug',
            severity: 'minor',
            title: 'Untranslated strings found on dashboard',
            description: `Found ${untranslated} English-only strings when Dutch language is active`,
          });
        }
      },
    },
    {
      name: 'Verify projects page is translated',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/projects`);
        await ctx.page.waitForLoadState('networkidle');

        const dutchProjectTerms = ['project', 'nieuw', 'aanmaken', 'status', 'methodologie'];
        let found = 0;
        for (const term of dutchProjectTerms) {
          const count = await ctx.page.locator(`text=/${term}/i`).count();
          if (count > 0) found++;
        }
        ctx.log(`Dutch project terms found: ${found}/${dutchProjectTerms.length}`);
      },
    },
    {
      name: 'Verify governance page is translated',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/governance/portfolios`);
        await ctx.page.waitForLoadState('networkidle');

        const dutchGovTerms = ['portfolio', 'bestuur', 'belanghebbenden', 'governance'];
        let found = 0;
        for (const term of dutchGovTerms) {
          const count = await ctx.page.locator(`text=/${term}/i`).count();
          if (count > 0) found++;
        }
        ctx.log(`Dutch governance terms found: ${found}/${dutchGovTerms.length}`);
      },
    },
    {
      name: 'Verify academy page is translated',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/academy`);
        await ctx.page.waitForLoadState('networkidle');

        const dutchAcademyTerms = ['cursus', 'opleiding', 'vaardigheden', 'certificaat', 'training'];
        let found = 0;
        for (const term of dutchAcademyTerms) {
          const count = await ctx.page.locator(`text=/${term}/i`).count();
          if (count > 0) found++;
        }
        ctx.log(`Dutch academy terms found: ${found}/${dutchAcademyTerms.length}`);
      },
    },
    {
      name: 'Verify reports page is translated',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/reports`);
        await ctx.page.waitForLoadState('networkidle');

        const dutchReportTerms = ['rapport', 'genereren', 'analyse', 'samenvatting'];
        let found = 0;
        for (const term of dutchReportTerms) {
          const count = await ctx.page.locator(`text=/${term}/i`).count();
          if (count > 0) found++;
        }
        ctx.log(`Dutch report terms found: ${found}/${dutchReportTerms.length}`);
      },
    },
    {
      name: 'Switch back to English',
      action: async (ctx) => {
        await ctx.page.evaluate(() => {
          localStorage.setItem('language', 'en');
          localStorage.setItem('i18nextLng', 'en');
        });
        await ctx.page.reload();
        await ctx.page.waitForLoadState('networkidle');
        ctx.log('Switched back to English');
      },
    },
    {
      name: 'Verify English is restored correctly',
      action: async (ctx) => {
        await ctx.page.goto(`${ctx.app.baseUrl}/dashboard`);
        await ctx.page.waitForLoadState('networkidle');

        const englishTerms = ['dashboard', 'projects', 'overview'];
        let found = 0;
        for (const term of englishTerms) {
          const count = await ctx.page.locator(`text=/${term}/i`).count();
          if (count > 0) found++;
        }
        ctx.log(`English terms restored: ${found}/${englishTerms.length}`);
      },
    },
  ],
};

export default scenario;
