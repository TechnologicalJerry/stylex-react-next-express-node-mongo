import type { Application } from 'express';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { serviceNames } from '../routes/services/registry.js';

export async function registerCommonMiddleware(app: Application) {
  app.use(express.json());
  app.use(cors({ origin: true, credentials: true }));
  app.use(helmet());
  app.use(
    rateLimit({
      max: 200,
      windowMs: 60 * 1000,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  const spec = swaggerJsdoc({
    definition: {
      openapi: '3.0.3',
      info: {
        title: 'AI Support Ticket Assistant API',
        description: 'Express microservices boilerplate',
        version: '1.0.0'
      },
      paths: {
        '/health': {
          get: {
            summary: 'Server health'
          }
        },
        '/services': {
          get: {
            summary: 'List registered services'
          }
        },
        '/api/{service}/health': {
          get: {
            summary: 'Service-level health check',
            parameters: [
              {
                in: 'path',
                name: 'service',
                required: true,
                schema: {
                  type: 'string',
                  enum: [...serviceNames]
                }
              }
            ]
          }
        }
      }
    },
    apis: []
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
}