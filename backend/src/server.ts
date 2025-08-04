import app from './app';
import { config } from './utils/config';

const startServer = (): void => {
  try {
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📄 Environment: ${config.nodeEnv}`);
      console.log(`🌐 CORS Origin: ${config.corsOrigin}`);
      console.log(`⚡ Health check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();