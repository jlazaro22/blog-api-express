import { app } from './app';
import config from './config';
import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose';
import { logger } from './lib/winston';

(async () => {
  try {
    await connectToDatabase();

    app.listen(config.PORT, config.HOST, () => {
      logger.info(`🚀 Server up on http://${config.HOST}:${config.PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start the server.', err);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();

    logger.warn('Server SHUTDOWN.');
    process.exit(0);
  } catch (err) {
    logger.error('Error during server shutdown.', err);
  }
};

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
