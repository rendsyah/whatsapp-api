import express, { Request, Response, NextFunction } from "express";
import { Client, MessageMedia } from "whatsapp-web.js";
import dotenv from "dotenv";
import cors from "cors";
import qrcode from "qrcode-terminal";
import fs from "fs";
import appRoot from "app-root-path";

dotenv.config();

// LOGGER
import { logger } from "./config/logger";

// SERVICES
import { authWA } from "./services/auth/authWA";

// LIBARY
import { validateRequestParams, validateRequestHp, validateRequestBuffer, validateGenerateError } from "./lib/baseFunctions";

const app = express();

// CONFIG ENVIRONMENT
const PROGRAM_PORT = process.env.PROGRAM_PORT;
const PROGRAM_NAME = process.env.PROGRAM_NAME;

// CONFIG SESSION
const SESSION_CLIENT = process.env.SESSION_CLIENT ?? "";
const SESSION_FILE_PATH = process.env.SESSION_FILE_PATH ?? "";

// CONFIG API
const API_VALIDATION = process.env.API_VALIDATION ?? "";
const API_CHATBOT = process.env.API_CHATBOT ?? "";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// WHATSAPP CLIENT
const client = new Client({
    puppeteer: {
        headless: true,
    },
    takeoverTimeoutMs: 10000,
    qrMaxRetries: 10000,
    authStrategy: authWA(SESSION_CLIENT, SESSION_FILE_PATH),
});

// WHATSAPP RESTORING AUTH SESSION
if (fs.existsSync(SESSION_FILE_PATH)) {
    logger.info("Whatsapp restoring session...");
}

// WHATSAPP GENERATE QR CODE
client.on("qr", (qr) => {
    logger.info("Whatsapp QR Code received");
    qrcode.generate(qr, { small: true });
});

// WHATSAPP CONNECT
client.on("ready", async () => {
    const whatsappVersion = await client.getWWebVersion();
    logger.info("Whatsapp is connected!");
    logger.info(`Whatsapp version ${whatsappVersion}`);
});

// WHATSAPP AUTH SESSION
client.on("authenticated", () => {
    logger.info("Whatsapp authentication success!");
});

// WHATSAPP GET MESSAGE
client.on("message", async (message) => {
    try {
    } catch (error: any) {
        validateGenerateError(error.message, error.status);
    }
});

// WHATSAPP CONNECTION
client.on("change_state", (state) => {
    logger.info("Whatsapp connection", state);
});

// WHATSAPP DISCONNECT
client.on("disconnected", async (reason) => {
    logger.info("Whatsapp is disconnected!", reason);
    await client.destroy();
});

// WHATSAPP INITALIZE
client.initialize();

// MIDDLEWARE RESPONSE ERROR
app.use((err: any, req: Request, res: Response, next: NextFunction) => res.status(500).send({ message: "internal server error!" }));

// LISTENING API
app.listen(PROGRAM_PORT, () => logger.info(`${PROGRAM_NAME} is connected!`));
