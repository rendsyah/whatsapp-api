// Modules
import winston from "winston";

// Desctructuring Modules
const { createLogger, format, transports } = winston;
const { combine, colorize, timestamp, printf, errors, ms } = format;

// Logger Transports
const loggerTransport = {
    console: new transports.Console(),
};

// Logger Format
const loggerFormat = printf(({ level, message, timestamp, stack, ms }) => {
    return `${timestamp} ${level}: ${message || stack} (${ms})`;
});

// Logger Development
export const loggerDev = createLogger({
    format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), ms(), loggerFormat),
    defaultMeta: { service: process.env.PROGRAM_NAME },
    transports: [loggerTransport.console],
});
