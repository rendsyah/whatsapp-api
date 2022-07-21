import * as winston from "winston";
import appRoot from "app-root-path";

const { createLogger, format, transports } = winston;
const { combine, colorize, timestamp, printf, json, errors } = format;

const loggerTransport = {
    console: new transports.Console(),
    loggerInfo: new transports.File({
        filename: `${appRoot}../logs/${process.env.PROGRAM_NAME}/info/${new Date()}`,
        maxFiles: 7,
        maxsize: 500,
        level: "info",
    }),
    loggerError: new transports.File({
        filename: `${appRoot}../logs/${process.env.PROGRAM_NAME}/error/${new Date()}`,
        maxFiles: 7,
        maxsize: 500,
        level: "error",
    }),
};

const loggerFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${message || stack}`;
});

export const logger = createLogger({
    format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), loggerFormat),
    transports: [loggerTransport.console],
});

export const loggerInfo = createLogger({
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
    defaultMeta: { service: process.env.PROGRAM_NAME },
    transports: [loggerTransport.loggerInfo],
});

export const loggerError = createLogger({
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
    defaultMeta: { service: process.env.PROGRAM_NAME },
    transports: [loggerTransport.loggerError],
});
