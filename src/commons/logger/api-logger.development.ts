// Import Modules
import * as winston from 'winston';
import * as expressWinston from 'express-winston';

// Import Transports
import { apiLoggerTransports } from './api-logger.transport';

// Destructuring Modules
const { createLogger, format } = winston;
const { combine, timestamp, json } = format;

// Define Logger Format
const apiLoggerFormat = format.printf(({ timestamp, level, message, stack, ms, ...meta }) => {
    return `${timestamp} [${Object.values(meta)}] ${level}: ${message || stack} (${ms})`;
});

// Define Logger Development Service
export const apiLoggerDevelopmentService = createLogger({
    format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        format.errors({ stack: true }),
        format.ms(),
        apiLoggerFormat,
    ),
    transports: [apiLoggerTransports.console],
});

// Define Logger Production Api
export const apiLoggerDevelopment = {
    format: combine(timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }), json()),
    requestWhitelist: ['body', 'query', 'params', 'method', 'originalUrl', 'headers.x-forwarded-for', 'connection.remoteAddress'],
    responseWhitelist: [...expressWinston.responseWhitelist, 'body'],
    transports: [apiLoggerTransports.console],
};
