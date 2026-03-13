import type { Scenario } from '../../core/types.js';
import login from './01-login.js';
import projects from './02-projects.js';
import tasks from './03-tasks.js';
import aiChat from './04-ai-chat.js';
import notifications from './05-notifications.js';
import apiHealth from './06-api-health.js';

export const projectpalMobileScenarios: Scenario[] = [
  login,
  projects,
  tasks,
  aiChat,
  notifications,
  apiHealth,
];

export default projectpalMobileScenarios;
