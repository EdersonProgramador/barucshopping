import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const neonEnv = fs.readFileSync(path.join(root, '.env.neon'), 'utf8');
const env = Object.fromEntries(
  neonEnv
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      const key = l.slice(0, i);
      let val = l.slice(i + 1);
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      return [key, val];
    })
);

const url =
  env.DATABASE_URL_UNPOOLED || env.POSTGRES_URL_NON_POOLING || env.DATABASE_URL;
if (!url) {
  console.error('No DATABASE_URL found in .env.neon');
  process.exit(1);
}

const out = [
  `DATABASE_URL=${JSON.stringify(url)}`,
  'JWT_ACCESS_SECRET="local-dev-access-secret-change-me-32"',
  'JWT_REFRESH_SECRET="local-dev-refresh-secret-change-me-32"',
  'CLIENT_URL="https://barucshopping-lqeb.vercel.app"',
  'NODE_ENV=production',
  'PORT=3333',
  '',
].join('\n');

fs.writeFileSync(path.join(root, 'server', '.env'), out);
const host = url.replace(/^.*@/, '').split('/')[0];
console.log('Wrote server/.env for Neon host:', host);
