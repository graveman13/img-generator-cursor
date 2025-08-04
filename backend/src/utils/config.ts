import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  jwtSecret: string;
  replicateApiToken: string;
  nodeEnv: string;
  corsOrigin: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3001', 10),
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
  replicateApiToken: process.env.REPLICATE_API_TOKEN || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};