import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, json, urlencoded } from 'express';
import helmet from 'helmet';

import { corsOptions } from './lib/cors';
import rateLimiter from './lib/express-rate-limit';
import v1Routes from './routes/v1/index';

export const app: Application = express();

app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  compression({
    threshold: 1024, // only compress responses larger than 1KB
  }),
);
app.use(helmet());
app.use(rateLimiter);

// Routes
app.use('/api/v1', v1Routes);
