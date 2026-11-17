import app from './app';
import { env } from './config/env';

// Local / Render long-running process. On Vercel the platform uses `src/app.ts`.
if (!process.env.VERCEL) {
  app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`🚀 Baruc Shopping API running at http://0.0.0.0:${env.PORT}`);
  });
}

export default app;
