import type { Scenario } from '../../core/types.js';
import login from './01-login.js';
import dashboard from './02-dashboard.js';
import campaigns from './03-campaigns.js';
import contentHub from './04-content-hub.js';
import automation from './05-automation.js';
import aiMarketing from './06-ai-marketing.js';
import events from './07-events.js';
import sidebarNavigation from './08-sidebar-navigation.js';
import apiHealth from './09-api-health.js';

export const goScenarios: Scenario[] = [
  login,
  dashboard,
  campaigns,
  contentHub,
  automation,
  aiMarketing,
  events,
  sidebarNavigation,
  apiHealth,
];

export default goScenarios;
