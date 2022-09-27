// Modules
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import appRootPath from "app-root-path";
import expressWinston from "express-winston";

dotenv.config();

// Interfaces
import { IRequestDataError } from "./config/lib/base.dto";

// Commons
import { configQueues } from "./config/queues";
import { whatsappConnectQueue, whatsappMessageQueue } from "./modules/whatsapp/whatsapp.process";
import { mongoConnection } from "./databases";
import { whatsappService } from "./modules/whatsapp/whatsapp.service";
import { loggerDev } from "./config/logs/logger.development";
import { loggerInfo, loggerError } from "./config/logs/logger.production";
import { router } from "./routes";
import { swaggerRouter } from "./config/openAPI";
import { responseApiError } from "./config/lib/baseFunctions";

// Service Environments
const PROGRAM_PORT = process.env.PROGRAM_PORT as string;
const PROGRAM_NAME = process.env.PROGRAM_NAME as string;
const WHATSAPP_MEDIA_PATH = process.env.WHATSAPP_MEDIA_PATH as string;

// Init Express
const app = express();

// Config Queues
const whatsappProcessQueues = [whatsappConnectQueue(), whatsappMessageQueue()];
const queues = configQueues(whatsappProcessQueues);

// Config API Service
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/image", express.static(`${appRootPath}/..${WHATSAPP_MEDIA_PATH}image`));
app.use("/docs", express.static(`${appRootPath}/..${WHATSAPP_MEDIA_PATH}docs`));
app.use("/video", express.static(`${appRootPath}/..${WHATSAPP_MEDIA_PATH}video`));

// Mongo Database Connection
mongoConnection();

// Whatsapp Initialization
whatsappService();

// Info Logger For Production
app.use(expressWinston.logger(loggerInfo));

// Grouping Swagger OpenAPI
app.use(swaggerRouter);

// Grouping Queues
app.use("/admin/queues", queues.getRouter());

// Grouping API
app.use("/api", router);

// Error Logger For Production
app.use(expressWinston.errorLogger(loggerError));

// Middleware Response Error
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const requestResponseData: IRequestDataError = {
        code: error.code || 500,
        status: error.status || "Internal Server Error",
        params: error.params || "",
        detail: error.detail || error.message || "service error, try again",
    };

    return res.status(500).send(responseApiError(requestResponseData));
});

// Listening Service
app.listen(PROGRAM_PORT, () => loggerDev.info(`${PROGRAM_NAME} running on port ${PROGRAM_PORT}`));
