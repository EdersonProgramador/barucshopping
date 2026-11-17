import path from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { routes } from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

export const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

export function createApp() {
  const app = express();

  // cross-origin so the SPA (:3000) can load images served by the API (:3333)
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  const allowedOrigins = [
    env.CLIENT_URL,
    'https://barucshopping-lqeb.vercel.app',
    'https://barucshopping.com.br',
    'https://www.barucshopping.com.br',
    'http://localhost:3000',
  ].filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: '2mb' }));
  if (env.NODE_ENV === 'development') app.use(morgan('dev'));

  app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

  // Locally uploaded product images (fallback when Cloudinary is not configured)
  app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d', immutable: true }));

  app.use('/api', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
