// Modules
import { connect, connection } from "mongoose";

// Logger
import { loggerDev } from "../config/logs/logger";

// Database Environments
const DATABASE_MONGO_URL = process.env.DATABASE_MONGO_URL as string;

// Mongo Database Connection
export const mongoConnection = () => {
    connect(DATABASE_MONGO_URL, { maxPoolSize: 10 })
        .catch((error) => loggerDev.error(error))
        .finally();

    connection.once("open", () => loggerDev.info("Whatsapp database is connected!"));
    connection.on("disconnected", () => loggerDev.info("Whatsapp database disconnected!"));
};
