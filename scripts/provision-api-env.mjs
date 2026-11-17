import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const neonEnv = fs.readFileSync(path.join(root, '.env.neon'), 'utf8');
const env = Object.fromEntries(
  neonEnv
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      let val = l.slice(i + 1);
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      return [l.slice(0, i), val];
    })
);

const databaseUrl =
  env.DATABASE_URL_UNPOOLED || env.POSTGRES_URL_NON_POOLING || env.DATABASE_URL;
if (!databaseUrl) {
  console.error('Missing DATABASE_URL in .env.neon');
  process.exit(1);
}

const payload = {
  DATABASE_URL: databaseUrl,
  JWT_ACCESS_SECRET: crypto.randomBytes(48).toString('base64'),
  JWT_REFRESH_SECRET: crypto.randomBytes(48).toString('base64'),
  CLIENT_URL: 'https://barucshopping-lqeb.vercel.app',
  NODE_ENV: 'production',
};

fs.writeFileSync(path.join(root, '.api-env.json'), JSON.stringify(payload));
console.log('Wrote .api-env.json (gitignored)');
