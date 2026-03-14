import { Pool } from 'pg';
import { env } from '../config/env.js';

export function createPostgresPool() {
  return new Pool({
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DATABASE,
    max: 10
  });
}