import type { Application, Router } from 'express';
import { getAppLocals } from '../../types/express.js';
import { analyticsServiceRouter } from './analytics.js';
import { authServiceRouter } from './auth.js';
import { billingServiceRouter } from './billing.js';
import { inventoryServiceRouter } from './inventory.js';
import { notificationsServiceRouter } from './notifications.js';
import { paymentsServiceRouter } from './payments.js';
import { reportsServiceRouter } from './reports.js';
import { searchServiceRouter } from './search.js';
import { slaServiceRouter } from './sla.js';
import { ticketsServiceRouter } from './tickets.js';
import { usersServiceRouter } from './users.js';

type RegistryEntry = {
  name: string;
  router: Router;
};

const serviceRegistry: RegistryEntry[] = [
  { name: 'auth', router: authServiceRouter },
  { name: 'users', router: usersServiceRouter },
  { name: 'tickets', router: ticketsServiceRouter },
  { name: 'billing', router: billingServiceRouter },
  { name: 'payments', router: paymentsServiceRouter },
  { name: 'notifications', router: notificationsServiceRouter },
  { name: 'analytics', router: analyticsServiceRouter },
  { name: 'inventory', router: inventoryServiceRouter },
  { name: 'search', router: searchServiceRouter },
  { name: 'reports', router: reportsServiceRouter },
  { name: 'sla', router: slaServiceRouter }
];

export function registerServiceRoutes(app: Application) {
  const locals = getAppLocals(app);
  locals.serviceRegistry = serviceRegistry.map((service) => service.name);

  for (const service of serviceRegistry) {
    app.use(`/api/${service.name}`, service.router);
  }

  app.get('/services', (_req, res) => {
    res.json({
      count: locals.serviceRegistry.length,
      services: locals.serviceRegistry
    });
  });
}