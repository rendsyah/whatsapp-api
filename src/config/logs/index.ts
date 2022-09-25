// Loggers
import { loggerDev, loggerProd } from "./logger";

const logger = process.env.NODE_ENV === "development" ? loggerDev : loggerProd;

export default logger;
