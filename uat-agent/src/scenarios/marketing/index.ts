import type { Scenario } from '../../core/types.js';
import login from './01-login.js';
import dashboard from './02-dashboard.js';
import campaigns from './03-campaigns.js';
import contacts from './04-contacts.js';
import apiHealth from './05-api-health.js';
import emailMarketing from './06-email-marketing.js';
import mailingLists from './07-mailing-lists.js';
import newsletterTemplates from './08-newsletter-templates.js';
import communication from './09-communication.js';
import executionStakeholders from './10-execution-stakeholders.js';
import globalNewsletters from './11-global-newsletters.js';
import aiMarketing from './12-ai-marketing.js';
import marketingAutomation from './13-marketing-automation.js';
import analyticsBudget from './14-analytics-budget.js';

export const marketingScenarios: Scenario[] = [
  login,
  dashboard,
  campaigns,
  contacts,
  apiHealth,
  emailMarketing,
  mailingLists,
  newsletterTemplates,
  communication,
  executionStakeholders,
  globalNewsletters,
  aiMarketing,
  marketingAutomation,
  analyticsBudget,
];

export default marketingScenarios;
