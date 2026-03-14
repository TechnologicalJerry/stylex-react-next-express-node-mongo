import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

export function createMySqlPool() {
  return mysql.createPool({
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    connectionLimit: 10,
    waitForConnections: true
  });
}