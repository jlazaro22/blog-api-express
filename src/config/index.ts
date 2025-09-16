import 'dotenv/config';

const config = {
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST || 'localhost',
  PORT: Number(process.env.PORT) || 3000,
  WHITELIST_ORIGINS: ['https://docs.blog-api.tutorial.com'],
  MONGO_URI: process.env.MONGO_URI,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

export default config;
