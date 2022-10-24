// Modules
import { connect, connection } from "mongoose";

// Commons
import { loggerDev } from "../config/logs/logger.development";

// Database Environments
const DATABASE_MONGO_HOST = process.env.DATABASE_MONGO_HOST as string;

// Mongo Database Connection
export const mongoConnection = (): void => {
    connect(DATABASE_MONGO_HOST, { maxPoolSize: 10 })
        .catch((error) => loggerDev.error(error))
        .finally();

    connection.once("open", () => loggerDev.info("Whatsapp database connected"));
    connection.on("disconnected", () => loggerDev.info("Whatsapp database disconnected"));
};
