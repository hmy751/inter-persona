import dotenv from 'dotenv';
import path from 'path';

const environment = process.env.NODE_ENV || 'development';

const envPath = path.resolve(process.cwd(), `.env.${environment}`);

dotenv.config({ path: envPath });

const config = {
  env: environment,
  isProduction: environment === 'production',
  isDevelopment: environment === 'development',
  server: {
    port: parseInt(process.env.PORT || '8000', 10),
    host: process.env.HOST || 'localhost',
  },
  db: {
    url: process.env.DATABASE_URL,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
};

export default config;
