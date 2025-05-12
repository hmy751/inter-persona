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
  jwt: {
    secret: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  db: {
    url: process.env.DATABASE_URL,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  s3: {
    bucketName: process.env.S3_BUCKET_NAME,
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  grok: {
    apiKey: process.env.GROK_API_KEY,
  },
};

export default config;
