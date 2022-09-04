// Loggers
import { loggerDev, loggerProd } from "./logger";

// Setting Loggers
export const logger = process.env.NODE_ENV === "development" ? loggerDev : loggerProd;
