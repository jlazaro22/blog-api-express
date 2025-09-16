import { CorsOptions } from 'cors';
import config from 'src/config';
import { logger } from './winston';

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS error: ${origin} is not allowed.`), false);
      logger.warn(`CORS error: ${origin} is not allowed.`);
    }
  },
};
