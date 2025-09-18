import 'dotenv/config';

import type ms from 'ms';

const config = {
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST || 'localhost',
  PORT: Number(process.env.PORT) || 3000,
  WHITELIST_ORIGINS: ['https://docs.blog-api.tutorial.com'],
  MONGO_URI: process.env.MONGO_URI,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  WHITELIST_ADMINS_MAIL: ['john.doe@example.com', 'jane.doe@example.com'],
  defaultResLimit: 20,
  defaultResOffset: 0,
};

export default config;
