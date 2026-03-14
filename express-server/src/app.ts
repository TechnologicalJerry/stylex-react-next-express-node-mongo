import express from 'express';
import type { Application } from 'express';
import { registerCommonMiddleware } from './middleware/common.js';
import { registerDatabases } from './middleware/databases.js';
import { healthRouter } from './routes/health.js';
import { registerServiceRoutes } from './routes/services/index.js';
import { getAppLocals } from './types/express.js';

export async function buildApp() {
  const app = express();
  getAppLocals(app);

  await registerCommonMiddleware(app);
  await registerDatabases(app);
  app.use(healthRouter);
  registerServiceRoutes(app);

  return app;
}

export async function closeApp(app: Application) {
  const locals = getAppLocals(app);

  for (const task of locals.shutdownTasks) {
    await task();
  }

  locals.shutdownTasks = [];
}