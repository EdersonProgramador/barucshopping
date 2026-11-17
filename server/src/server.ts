import { createApp } from './create-app';
import { env } from './config/env';

const app = createApp();

// Local / Render long-running process. On Vercel the platform invokes the exported app.
if (!process.env.VERCEL) {
  app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`🚀 Baruc Shopping API running at http://0.0.0.0:${env.PORT}`);
  });
}

export default app;
