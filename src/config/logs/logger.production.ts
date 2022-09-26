// Modules
import winston from "winston";
import expressWinston from "express-winston";
import DailyRotateFile from "winston-daily-rotate-file";
import appRootPath from "app-root-path";

// Desctructuring Modules
const { createLogger, format } = winston;
const { combine, timestamp, json, errors } = format;

// Logger Transports
const loggerTransport = {
    loggerInfo: new DailyRotateFile({
        filename: `${appRootPath}/../logs/${process.env.PROGRAM_NAME}/info/%DATE%.log`,
        datePattern: "YYYY-MM-DD-HH",
        zippedArchive: true,
        maxSize: "100m",
        maxFiles: "14d",
        frequency: "1h",
    }),
    loggerError: new DailyRotateFile({
        filename: `${appRootPath}/../logs/${process.env.PROGRAM_NAME}/error/%DATE%.log`,
        datePattern: "YYYY-MM-DD-HH",
        zippedArchive: true,
        maxSize: "100m",
        maxFiles: "14d",
        frequency: "1h",
        level: "error",
    }),
};

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
