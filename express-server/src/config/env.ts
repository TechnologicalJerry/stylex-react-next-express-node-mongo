import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().int().positive().default(4000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  ENABLE_MONGO: z.coerce.boolean().default(false),
  ENABLE_MYSQL: z.coerce.boolean().default(false),
  ENABLE_POSTGRES: z.coerce.boolean().default(false),
  MONGO_URI: z.string().default('mongodb://127.0.0.1:27017/ai_support_tickets'),
  MYSQL_HOST: z.string().default('127.0.0.1'),
  MYSQL_PORT: z.coerce.number().int().positive().default(3306),
  MYSQL_USER: z.string().default('root'),
  MYSQL_PASSWORD: z.string().default('password'),
  MYSQL_DATABASE: z.string().default('ai_support_tickets'),
  POSTGRES_HOST: z.string().default('127.0.0.1'),
  POSTGRES_PORT: z.coerce.number().int().positive().default(5432),
  POSTGRES_USER: z.string().default('postgres'),
  POSTGRES_PASSWORD: z.string().default('password'),
  POSTGRES_DATABASE: z.string().default('ai_support_tickets')
});

export const env = envSchema.parse(process.env);