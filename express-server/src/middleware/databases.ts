import type { Application } from 'express';
import { env } from '../config/env.js';
import { connectMongo } from '../db/mongo.js';
import { createMySqlPool } from '../db/mysql.js';
import { createPostgresPool } from '../db/postgres.js';
import { getAppLocals } from '../types/express.js';

export async function registerDatabases(app: Application) {
  const locals = getAppLocals(app);

  if (env.ENABLE_MONGO) {
    locals.mongo = await connectMongo();
    console.info('MongoDB connected');
    locals.shutdownTasks.push(async () => {
      if (locals.mongo) {
        await locals.mongo.close();
      }
    });
  }

  if (env.ENABLE_MYSQL) {
    locals.mysql = createMySqlPool();
    await locals.mysql.query('SELECT 1');
    console.info('MySQL connected');
    locals.shutdownTasks.push(async () => {
      if (locals.mysql) {
        await locals.mysql.end();
      }
    });
  }

  if (env.ENABLE_POSTGRES) {
    locals.postgres = createPostgresPool();
    await locals.postgres.query('SELECT 1');
    console.info('PostgreSQL connected');
    locals.shutdownTasks.push(async () => {
      if (locals.postgres) {
        await locals.postgres.end();
      }
    });
  }
}