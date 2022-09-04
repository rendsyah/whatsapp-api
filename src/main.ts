// Modules
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import appRoot from "app-root-path";
import * as expressWinston from "express-winston";

dotenv.config();

// Interfaces
import { IResponseApiError } from "./config/lib/baseFunctions.interface";

// Providers
import { mongoConnection } from "./databases";
import { whatsappService } from "../src/whatsapp/whatsapp.service";
import { loggerDev, loggerInfo, loggerError } from "./config/logs/logger";
import { router } from "./routes";
import { responseApiError } from "./config/lib/baseFunctions";

// Service Environments
const PROGRAM_PORT = process.env.PROGRAM_PORT as string;
const PROGRAM_NAME = process.env.PROGRAM_NAME as string;
const WHATSAPP_MEDIA_PATH = process.env.WHATSAPP_MEDIA_PATH as string;

// Init Express
const app = express();

// Config API Service
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/image", express.static(`${appRoot}/..${WHATSAPP_MEDIA_PATH}image`));
app.use("/docs", express.static(`${appRoot}/..${WHATSAPP_MEDIA_PATH}docs`));
app.use("/video", express.static(`${appRoot}/..${WHATSAPP_MEDIA_PATH}video`));

// Mongo Database Connection
mongoConnection();

// Whatsapp Initialization
whatsappService();

// Info Logger For Production
app.use(expressWinston.logger(loggerInfo));

// Grouping API
app.use("/api", router);

// Error Logger For Production
app.use(expressWinston.errorLogger(loggerError));

// Middleware Response Error
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const requestApiError = {
        code: 500,
        message: "internal server error!",
        params: [],
        detail: "",
    };
    return res.status(500).send(responseApiError(requestApiError as IResponseApiError));
});

// Listening Service
app.listen(PROGRAM_PORT, () => loggerDev.info(`${PROGRAM_NAME} running on port ${PROGRAM_PORT}`));
