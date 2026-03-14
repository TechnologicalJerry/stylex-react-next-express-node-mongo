import { Router } from 'express';
import { getAppLocals } from '../types/express.js';

export const healthRouter = Router();

healthRouter.get('/health', (req, res) => {
  const locals = getAppLocals(req.app);

  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    databases: {
      mongo: Boolean(locals.mongo),
      mysql: Boolean(locals.mysql),
      postgres: Boolean(locals.postgres)
    }
  });
});