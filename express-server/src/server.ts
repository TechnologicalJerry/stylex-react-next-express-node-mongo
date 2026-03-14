import { env } from './config/env.js';
import { buildApp, closeApp } from './app.js';

async function start() {
  const app = await buildApp();
  const server = app.listen(env.PORT, env.HOST, () => {
    console.info(`Server listening at http://${env.HOST}:${env.PORT}`);
  });

  const shutdown = async (signal: string) => {
    console.info(`Received ${signal}, shutting down`);

    server.close(async (error) => {
      if (error) {
        console.error(error);
        process.exit(1);
      }

      try {
        await closeApp(app);
        process.exit(0);
      } catch (shutdownError) {
        console.error(shutdownError);
        process.exit(1);
      }
    });
  };

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
}

void start();