import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { setupRoutes } from './routes';
import { setupLogger } from './utils/logger';

// Load environment variables
config();

// Initialize logger
const logger = setupLogger();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // 允许的源列表
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    
    // 开发环境：允许所有localhost端口
    if (process.env.NODE_ENV !== 'production') {
      if (!origin || (origin && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')))) {
        return callback(null, true);
      }
    }
    
    // 生产环境或明确配置的源
    if (!origin || (origin && allowedOrigins.includes(origin))) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Setup routes
setupRoutes(app);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;