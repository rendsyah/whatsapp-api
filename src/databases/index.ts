// Modules
import { connect, connection } from "mongoose";

// Commons
import { loggerDev } from "../config/logs/logger.development";

// Database Environments
const DATABASE_MONGO_HOST = process.env.DATABASE_MONGO_HOST as string;
const DATABASE_MONGO_USER = process.env.DATABASE_MONGO_USER as string;
const DATABASE_MONGO_PASS = process.env.DATABASE_MONGO_PASS as string;
const DATABASE_MONGO_NAME = process.env.DATABASE_MONGO_NAME as string;
const DATABASE_MONGO_AUTH = process.env.DATABASE_MONGO_AUTH as string;

// Mongo Database Connection
export const mongoConnection = (): void => {
    const mongoOptions = {
        user: DATABASE_MONGO_USER,
        pass: DATABASE_MONGO_PASS,
        dbName: DATABASE_MONGO_NAME,
        authSource: DATABASE_MONGO_AUTH,
        maxPoolSize: 10,
    };

    connect(DATABASE_MONGO_HOST, mongoOptions)
        .catch((error) => loggerDev.error(error))
        .finally();

    connection.once("open", () => loggerDev.info("Whatsapp database connected"));
    connection.on("error", () => loggerDev.error("Whatsapp database error"));
    connection.on("disconnected", () => loggerDev.info("Whatsapp database disconnected"));
};
