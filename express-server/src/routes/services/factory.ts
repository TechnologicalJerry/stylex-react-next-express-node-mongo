import { Router } from 'express';

export function createServiceRouter(serviceName: string) {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({
      service: serviceName,
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  });

  router.get('/', (_req, res) => {
    res.json({
      service: serviceName,
      message: `${serviceName} service ready`
    });
  });

  router.post('/event', (req, res) => {
    res.json({
      service: serviceName,
      received: true,
      payload: req.body ?? {}
    });
  });

  return router;
}