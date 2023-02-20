// Import All Logs
import { apiLoggerDevelopment, apiLoggerDevelopmentService } from './api-logger.development';
import { apiLoggerProduction, apiLoggerProductionService } from './api-logger.production';

const NODE_ENV = process.env.NODE_ENV === 'development';

// Define Log Service
export const apiLoggerService = NODE_ENV ? apiLoggerDevelopmentService : apiLoggerProductionService;
export const apiLogger = NODE_ENV ? apiLoggerDevelopment : apiLoggerProduction;
