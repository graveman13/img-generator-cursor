import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  jwtSecret: string;
  huggingFaceToken: string;
  segmindApiKey: string;
  nodeEnv: string;
  corsOrigin: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '8080', 10),
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
  huggingFaceToken: process.env.HUGGING_FACE_TOKEN || '',
  segmindApiKey: process.env.SEGMIND_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};