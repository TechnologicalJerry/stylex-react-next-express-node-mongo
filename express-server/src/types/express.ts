import type { Application } from 'express';
import type { Connection as MongooseConnection } from 'mongoose';
import type { Pool as PgPool } from 'pg';
import type { Pool as MySqlPool } from 'mysql2/promise';

export type ShutdownTask = () => Promise<void>;

export type AppLocals = {
  mongo?: MongooseConnection;
  mysql?: MySqlPool;
  postgres?: PgPool;
  serviceRegistry: string[];
  shutdownTasks: ShutdownTask[];
};

export function getAppLocals(app: Application): AppLocals {
  const locals = app.locals as Partial<AppLocals>;

  if (!locals.serviceRegistry) {
    locals.serviceRegistry = [];
  }

  if (!locals.shutdownTasks) {
    locals.shutdownTasks = [];
  }

  return locals as AppLocals;
}