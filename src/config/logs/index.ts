// Loggers
import { loggerDev } from "./logger.development";
import { loggerProd } from "./logger.production";

const logger = process.env.NODE_ENV === "development" ? loggerDev : loggerProd;

export default logger;
