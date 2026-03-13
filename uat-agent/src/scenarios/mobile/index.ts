import type { Scenario } from '../../core/types.js';
import login from './01-login.js';
import projects from './02-projects.js';
import notifications from './03-notifications.js';
import academy from './04-academy.js';
import programs from './05-programs.js';
import apiHealth from './06-api-health.js';

export const mobileScenarios: Scenario[] = [
  login,
  projects,
  notifications,
  academy,
  programs,
  apiHealth,
];

export default mobileScenarios;
