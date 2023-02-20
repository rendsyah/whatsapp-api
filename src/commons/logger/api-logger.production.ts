// Import Modules
import * as winston from 'winston';
import * as expressWinston from 'express-winston';

// Import Transports
import { apiLoggerTransports } from './api-logger.transport';

// Destructuring Modules
const { createLogger, format } = winston;
const { combine, timestamp, json } = format;

// Define Logger Production Service
export const apiLoggerProductionService = createLogger({
    format: combine(timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }), json()),
    transports: [apiLoggerTransports.error],
});

// Define Logger Production Api
export const apiLoggerProduction = {
    format: combine(timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }), json()),
    requestWhitelist: ['body', 'query', 'params', 'method', 'originalUrl', 'headers.x-forwarded-for', 'connection.remoteAddress'],
    responseWhitelist: [...expressWinston.responseWhitelist, 'body'],
    transports: [apiLoggerTransports.combine],
};
