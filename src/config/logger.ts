import * as winston from "winston";

const { createLogger, transports } = winston;
const { combine, colorize, timestamp, printf } = winston.format;

const loggerFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
});

export const logger = createLogger({
    format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), loggerFormat),
    transports: [new transports.Console()],
});
