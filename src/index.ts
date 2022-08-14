import express, { Request, Response, NextFunction } from "express";
import { Client, MessageMedia } from "whatsapp-web.js";
import dotenv from "dotenv";
import cors from "cors";
import qrcode from "qrcode-terminal";
import fs from "fs";
import appRoot from "app-root-path";
import path from "path";
import * as expressWinston from "express-winston";

dotenv.config();

// Axios Interceptors
import axios from "./config/interceptors/axios";

// Logger
import { loggerDev, loggerInfo, loggerError } from "./config/logs/logger";

// Middlewares
import { authWA } from "./middlewares/auth";
import { upload } from "./middlewares/upload";
import { validation } from "./middlewares/validation";

// Validation Schema
import { callbackSchema } from "./schema/validation.pipe";

// Base Functions Libary
import {
    validateRequestParams,
    validateRequestHp,
    validateRequestBuffer,
    validateGenerateError,
    validateRequestMoment,
    validateRequestEmoji,
    randomString,
    sendRequestMessage,
    responseApiSuccess,
    responseApiError,
} from "./config/lib/baseFunctions";

import { MediaTypes } from "./config/interfaces/whatsapp.dto";
import { HttpResponseStatus } from "./config/interfaces/responseStatus.dto";

const { Ok, Created, BadRequest, Unauthorized, Forbidden, NotFound, InternalServerError, BadGateway } = HttpResponseStatus;

const app = express();

// Config Program
const PROGRAM_PORT = process.env.PROGRAM_PORT;
const PROGRAM_NAME = process.env.PROGRAM_NAME;

// Config Session
const SESSION_CLIENT = process.env.SESSION_CLIENT ?? "";
const SESSION_FILE_PATH = process.env.SESSION_FILE_PATH ?? "";

// Config Media
const MEDIA_PATH = process.env.MEDIA_PATH ?? "";
const UPLOAD_PATH = process.env.UPLOAD_PATH ?? "";

// Config API
const API_CONNECT = process.env.API_CONNECT ?? "";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/image", express.static(`${appRoot}/..${MEDIA_PATH}image`));
app.use("/docs", express.static(`${appRoot}/..${MEDIA_PATH}docs`));
app.use("/video", express.static(`${appRoot}/..${MEDIA_PATH}video`));

// Whatsapp Client
const client = new Client({
    puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true,
    },
    takeoverTimeoutMs: 10000,
    qrMaxRetries: 10000,
    authStrategy: authWA(SESSION_CLIENT, SESSION_FILE_PATH),
});

// Whatsapp Restore Auth Session
if (fs.existsSync(SESSION_FILE_PATH)) {
    loggerDev.info("Whatsapp restoring session...");
}

// Whatsapp Generate QR Code
client.on("qr", (qr) => {
    loggerDev.info("Whatsapp QR Code received");
    qrcode.generate(qr, { small: true });
});

// Whatsapp Connected
client.on("ready", async () => {
    const whatsappVersion = await client.getWWebVersion();

    if (!fs.existsSync(`${appRoot}/..${MEDIA_PATH}` && `${appRoot}/..${UPLOAD_PATH}`)) {
        const folders: readonly string[] = [`${appRoot}/..${MEDIA_PATH}`, `${appRoot}/..${UPLOAD_PATH}`];
        folders.forEach((path, i) => {
            fs.mkdir(path, { recursive: true }, async (error) => {
                if (error) await validateGenerateError(error);
                if (!error) {
                    loggerDev.info(`Whatsapp ${i === 0 ? "public" : "upload"} directory has been created!`);
                }
            });
        });
    }

    loggerDev.info("Whatsapp is connected!");
    loggerDev.info(`Whatsapp version ${whatsappVersion}`);
});

// Whatsapp Authentication
client.on("authenticated", () => {
    loggerDev.info("Whatsapp authentication success!");
});

// Whatsapp Get Message
client.on("message", async (message) => {
    try {
        const waContact = await message.getContact();
        const waName = validateRequestParams(validateRequestEmoji(waContact.pushname), "any");
        const waMessage = validateRequestParams(message.body, "any");
        const waSender = validateRequestParams(message.from, "num");
        const waTimestamp = validateRequestParams(new Date(), "rcvdTime");

        let waMedia: string;

        // Received & Save Media
        if (message.hasMedia) {
            const mediaAttachment = await message.downloadMedia();
            const mediaAttachmentType = mediaAttachment.mimetype.split("/");
            const [mediaType, mediaExtension] = mediaAttachmentType;

            const mediaFilename = `${validateRequestMoment(new Date(), "datetime2")}_${randomString(5)}`;
            const mediaData = validateRequestParams(mediaAttachment.data, "any");
            const media = `${mediaFilename}.${mediaExtension}`;

            const mediaDirectory = MediaTypes[mediaType as keyof typeof MediaTypes];

            // Check Media Directory
            if (!fs.existsSync(`${appRoot}/..${MEDIA_PATH}${mediaDirectory}`)) {
                fs.mkdir(`${appRoot}/..${MEDIA_PATH}${mediaDirectory}`, { recursive: true }, (error) => {
                    if (error) validateGenerateError(error);
                    if (!error) {
                        loggerDev.info("Whatsapp media directory has been created!");
                    }
                });
            }

            // Check Received Extension Media (IMAGE, VIDEO, DOCS)
            if (mediaType in MediaTypes) {
                const mediaAllowed: RegExp = /png|jpe?g|webp|mp4|pdf/i;
                const mediaCheck = mediaAllowed.test(path.extname(media));

                // Send Message If Extension Not Allowed
                if (!mediaCheck) {
                    return sendRequestMessage(client, waSender, "media extension not allowed! e.g (PNG, JPEG, JPG, WEBP, MP4, PDF)");
                }

                // Store Media To Directory
                fs.writeFile(`${appRoot}/..${MEDIA_PATH}${mediaDirectory}${media}`, mediaData, "base64", async (error) => {
                    if (error) await validateGenerateError(error);
                    if (!error) {
                        waMedia = media;
                    }
                });
            }
        }

        // Mapping Request Data
        const requestData = {
            name: waName,
            message: validateRequestBuffer(waMessage, "encode"),
            sender: waSender,
            media: "300",
            rcvdTime: waTimestamp,
            sessionId: validateRequestBuffer(waMessage, "encode"),
        };

        // Send Request Whatsapp and Get Response Data
        const responseData = await axios.post(API_CONNECT, requestData);

        // Send Request Whatsapp and Get Response Data
        // const responseData = await axios.get(`${API_CONNECT}?name=${waName}&sender=${waSender}&message=${waMessage}&timestamp=${waTimestamp}`);

        // Send Message To Client
        await sendRequestMessage(client, waSender, responseData.data?.message);

        // Send Message & Media To Client
        // await client.sendMessage(validateRequestHp(sender, "waGateway"), message, { media: MessageMedia.fromFilePath(`${appRoot}${MEDIA_PATH}${mediaDirectory}/${image}`) });
    } catch (error) {
        await validateGenerateError(error);
    }
});

// Whatsapp Check Connection
client.on("change_state", (state) => {
    loggerDev.info("Whatsapp connection restarting...", state);
});

// Whatsapp Disconnected
client.on("disconnected", async (reason) => {
    loggerDev.info("Whatsapp is disconnected!", reason);

    // If Client Disconnect & Remove Session
    fs.rmSync(`${SESSION_FILE_PATH}/session-${SESSION_CLIENT}`, { recursive: true, force: true });
    await client.destroy();
});

client.initialize();

// Info Logger For Production
app.use(expressWinston.logger(loggerInfo));

// API
app.post("/whatsapp/callback", validation(callbackSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message = req.body.message;
        const sender = req.body.sender;

        const responseData = await sendRequestMessage(client, sender, message);
        return res.status(Ok).send(responseApiSuccess(Ok, "success", responseData.id));
    } catch (error) {
        next(error);
    }
});

app.post("/whatsapp/broadcast", upload("file"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(200).send({ message: "success" });
    } catch (error) {
        next(error);
    }
});

// Error Logger For Production
app.use(expressWinston.errorLogger(loggerError));

// Middleware Response Error
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    return res.status(InternalServerError).send(responseApiError(InternalServerError, "internal server error!", [], ""));
});

// Listening Service
app.listen(PROGRAM_PORT, () => loggerDev.info(`${PROGRAM_NAME} running on port ${PROGRAM_PORT}`));
