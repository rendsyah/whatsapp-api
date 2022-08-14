import { loggerDev, loggerProd } from "./logger";

export const logger = process.env.NODE_ENV === "development" ? loggerDev : loggerProd;

export default logger;
