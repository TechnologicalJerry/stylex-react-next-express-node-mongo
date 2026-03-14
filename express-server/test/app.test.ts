import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { buildApp, closeApp } from '../src/app.js';

describe('Express server', () => {
  it('responds from health endpoint', async () => {
    const app = await buildApp();

    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');

    await closeApp(app);
  });

  it('exposes more than 10 services', async () => {
    const app = await buildApp();

    const response = await request(app).get('/services');
    expect(response.statusCode).toBe(200);
    expect(response.body.count).toBeGreaterThanOrEqual(10);

    await closeApp(app);
  });
});