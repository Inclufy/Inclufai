import type { Scenario } from '../../core/types.js';
import login from './01-login.js';
import projects from './02-projects.js';
import tasks from './03-tasks.js';
import aiChat from './04-ai-chat.js';
import notifications from './05-notifications.js';
import apiHealth from './06-api-health.js';
import dashboard from './07-dashboard.js';
import kanban from './08-kanban.js';
import aiReports from './09-ai-reports.js';
import profileSettings from './10-profile-settings.js';
import pushNotifications from './11-push-notifications.js';
import governance from './12-governance.js';

export const projectpalMobileScenarios: Scenario[] = [
  login,
  projects,
  tasks,
  aiChat,
  notifications,
  apiHealth,
  dashboard,
  kanban,
  aiReports,
  profileSettings,
  pushNotifications,
  governance,
];

export default projectpalMobileScenarios;
