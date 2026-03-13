import type { Scenario } from '../../core/types.js';
import login from './01-login.js';
import projectCrud from './02-project-crud.js';
import taskManagement from './03-task-management.js';
import aiChat from './04-ai-chat.js';
import kanbanBoard from './05-kanban-board.js';
import scrumSprint from './06-scrum-sprint.js';
import dashboard from './07-dashboard.js';
import academy from './08-academy.js';
import programs from './09-programs.js';
import apiHealth from './10-api-health.js';
import governance from './11-governance.js';
import aiReports from './12-ai-reports.js';
import academyAdvanced from './13-academy-advanced.js';
import aiCommander from './14-ai-commander.js';
import courseBuilder from './15-course-builder.js';
import roleDashboards from './16-role-dashboards.js';
import visualManagement from './17-visual-management.js';
import i18nDutch from './18-i18n-dutch.js';

export const projectpalScenarios: Scenario[] = [
  login,
  projectCrud,
  taskManagement,
  aiChat,
  kanbanBoard,
  scrumSprint,
  dashboard,
  academy,
  programs,
  apiHealth,
  governance,
  aiReports,
  academyAdvanced,
  aiCommander,
  courseBuilder,
  roleDashboards,
  visualManagement,
  i18nDutch,
];

export default projectpalScenarios;
