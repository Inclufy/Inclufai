import type { Scenario } from '../../core/types.js';
import login from './01-login.js';
import dashboard from './02-dashboard.js';
import invoices from './03-invoices.js';
import transactions from './04-transactions.js';
import invoiceActions from './05-invoice-actions.js';
import apiHealth from './06-api-health.js';

export const financeMobileScenarios: Scenario[] = [
  login,
  dashboard,
  invoices,
  transactions,
  invoiceActions,
  apiHealth,
];

export default financeMobileScenarios;
