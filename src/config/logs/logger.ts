// Modules
import * as winston from "winston";
import * as expressWinston from "express-winston";
import DailyRotateFile from "winston-daily-rotate-file";
import appRoot from "app-root-path";

// Desctructuring Modules
const { createLogger, format, transports } = winston;
const { combine, colorize, timestamp, printf, json, errors, ms } = format;

// Logger Transports
const loggerTransport = {
    console: new transports.Console(),
    loggerInfo: new DailyRotateFile({
        filename: `${appRoot}/../logs/${process.env.PROGRAM_NAME}/info/%DATE%.log`,
        datePattern: "YYYY-MM-DD-HH",
        zippedArchive: true,
        maxSize: "100m",
        maxFiles: "14d",
        frequency: "1h",
    }),
    loggerError: new DailyRotateFile({
        filename: `${appRoot}/../logs/${process.env.PROGRAM_NAME}/error/%DATE%.log`,
        datePattern: "YYYY-MM-DD-HH",
        zippedArchive: true,
        maxSize: "100m",
        maxFiles: "14d",
        frequency: "1h",
        level: "error",
    }),
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

// Logger Productions
export const loggerProd = createLogger({
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), json()),
    defaultMeta: { service: process.env.PROGRAM_NAME },
    transports: [loggerTransport.loggerInfo, loggerTransport.loggerError],
});

export const loggerInfo = {
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
    requestWhitelist: ["body", "query", "params", "method", "originalUrl", "headers.x-forwarded-for", "connection.remoteAddress"],
    responseWhitelist: [...expressWinston.responseWhitelist, "body"],
    transports: [loggerTransport.loggerInfo],
};

export const loggerError = {
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
    requestWhitelist: ["body", "query", "params", "method", "originalUrl", "headers.x-forwarded-for", "connection.remoteAddress"],
    responseWhitelist: [...expressWinston.responseWhitelist, "body"],
    transports: [loggerTransport.loggerError],
};
