import { loggerDev, loggerExtra } from "./logger";

export const logger = process.env.NODE_ENV === "development" ? loggerDev : loggerExtra;

export default logger;
