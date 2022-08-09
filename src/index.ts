import express, { Request, Response, NextFunction } from "express";
import { Client, MessageMedia } from "whatsapp-web.js";
import dotenv from "dotenv";
import cors from "cors";
import qrcode from "qrcode-terminal";
import * as expressWinston from "express-winston";
import fs from "fs";
import appRoot from "app-root-path";
import path from "path";

dotenv.config();

// AXIOS INTERCEPTORS
import axios from "./config/interceptors/axios";

// LOGGER
import { loggerDev, loggerProd } from "./config/logs/logger";

// MIDDLEWARE
import { authWA } from "./middlewares/auth/authWA";

// LIBARY
import {
    validateRequestParams,
    validateRequestHp,
    validateRequestBuffer,
    validateGenerateError,
    validateRequestMoment,
    validateRequestEmoji,
    randomString,
    responseApiSuccess,
    responseApiError,
    sendRequestMessage,
} from "./lib/baseFunctions";

import { MediaTypes, HttpResponseStatus } from "./config/interfaces/enum";

const { Ok, Created, BadRequest, Unauthorized, Forbidden, NotFound, InternalServerError, BadGateway } = HttpResponseStatus;

const app = express();

// CONFIG PROGRAM
const PROGRAM_PORT = process.env.PROGRAM_PORT;
const PROGRAM_NAME = process.env.PROGRAM_NAME;

// CONFIG SESSION
const SESSION_CLIENT = process.env.SESSION_CLIENT ?? "";
const SESSION_FILE_PATH = process.env.SESSION_FILE_PATH ?? "";

// CONFIG MEDIA
const MEDIA_PATH = process.env.MEDIA_PATH ?? "";

// CONFIG API
const API_CONNECT = process.env.API_CONNECT ?? "";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/media", express.static(`${appRoot}${MEDIA_PATH}image`));
app.use("/media", express.static(`${appRoot}${MEDIA_PATH}docs`));
app.use("/media", express.static(`${appRoot}${MEDIA_PATH}video`));

// WHATSAPP CLIENT
const client = new Client({
    puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true,
    },
    takeoverTimeoutMs: 10000,
    qrMaxRetries: 10000,
    authStrategy: authWA(SESSION_CLIENT, SESSION_FILE_PATH),
});

// WHATSAPP RESTORING AUTH SESSION
if (fs.existsSync(SESSION_FILE_PATH)) {
    loggerDev.info("Whatsapp restoring session...");
}

// WHATSAPP GENERATE QR CODE
client.on("qr", (qr) => {
    loggerDev.info("Whatsapp QR Code received");
    qrcode.generate(qr, { small: true });
});

// WHATSAPP CONNECT
client.on("ready", async () => {
    const whatsappVersion = await client.getWWebVersion();

    if (!fs.existsSync(`${appRoot}${MEDIA_PATH}`)) {
        fs.mkdir(`${appRoot}${MEDIA_PATH}`, { recursive: true }, (error) => {
            if (error) validateGenerateError(error);
            if (!error) loggerDev.info("Whatsapp public directory has been created!");
        });
    }

    loggerDev.info("Whatsapp is connected!");
    loggerDev.info(`Whatsapp version ${whatsappVersion}`);
});

// WHATSAPP AUTH SESSION
client.on("authenticated", () => {
    loggerDev.info("Whatsapp authentication success!");
});

// WHATSAPP GET MESSAGE
client.on("message", async (message) => {
    try {
        // STORE REQUEST DATA
        const waContact = await message.getContact();
        const waName = validateRequestParams(validateRequestEmoji(waContact.pushname), "any");
        const waMessage = validateRequestParams(message.body, "any");
        const waSender = validateRequestParams(message.from, "num");
        const waTimestamp = validateRequestParams(new Date(), "rcvdTime");

        let waMedia: string;

        // RECEIVED & SAVE MEDIA
        if (message.hasMedia) {
            const mediaAttachment = await message.downloadMedia();
            const mediaAttachmentType = mediaAttachment.mimetype.split("/");
            const [mediaType, mediaExtension] = mediaAttachmentType;

            const mediaFilename = `${validateRequestMoment(new Date(), "datetime2")}_${randomString(9)}`;
            const mediaData = validateRequestParams(mediaAttachment.data, "any");
            const media = `${mediaFilename}.${mediaExtension}`;

            const mediaDirectory = MediaTypes[mediaType as keyof typeof MediaTypes];

            // CHECK MEDIA DIRECTORY
            if (!fs.existsSync(`${appRoot}${MEDIA_PATH}${mediaDirectory}`)) {
                fs.mkdir(`${appRoot}${MEDIA_PATH}${mediaDirectory}`, { recursive: true }, (error) => {
                    if (error) validateGenerateError(error);
                    if (!error) loggerDev.info("Whatsapp media directory has been created!");
                });
            }

            // CHECK RECEIVED MEDIA (IMAGE, VIDEO, DOCS)
            if (mediaType in MediaTypes) {
                const mediaAllowed: RegExp = /png|jpe?g|webp|mp4|pdf/i;
                const mediaCheck = mediaAllowed.test(path.extname(media));

                // SEND MESSAGE IF EXTENSION NOT ALLOWED
                if (!mediaCheck) {
                    return sendRequestMessage(client, waSender, "media extension not allowed! e.g.(PNG, JPEG, JPG, WEBP, MP4, PDF)");
                }

                // STORE MEDIA TO DIRECTORY
                fs.writeFile(`${appRoot}${MEDIA_PATH}${mediaDirectory}/${media}`, mediaData, "base64", (error) => {
                    if (error) validateGenerateError(error);
                    if (!error) {
                        waMedia = media;
                        loggerDev.info("Whatsapp media has been downloaded!");
                    }
                });
            }
        }

        // SEND TEST MESSAGE
        // await client.sendMessage(`Hallo, ${waName}`)

        // SEND REQUEST WHATSAPP AND GET RESPONSE DATA
        const requestData = {
            name: waName,
            message: validateRequestBuffer(waMessage, "encode"),
            sender: waSender,
            media: "300",
            rcvdTime: waTimestamp,
            sessionId: validateRequestBuffer(waMessage, "encode"),
        };

        // SEND REQUEST WHATSAPP AND RESPONSE DATA
        // const responseData = await axios
        //     .post(API_CONNECT, requestData)
        //     .then((v) => v)
        //     .catch((error) => error);

        // GET REQUEST WHATSAPP AND RESPONSE DATA
        const responseData = await axios
            .get(`${API_CONNECT}?name=${waName}&sender=${waSender}&message=${waMessage}&timestamp=${waTimestamp}`)
            .then((v) => v)
            .catch((error) => error);

        // SEND WITH MESSAGE
        await sendRequestMessage(client, waSender, responseData.data?.message);

        // SEND WITH MESSAGE & MEDIA
        // await client.sendMessage(validateRequestHp(sender, "waGateway"), message, { media: MessageMedia.fromFilePath(`${appRoot}${MEDIA_PATH}${mediaDirectory}/${image}`) });
    } catch (error) {
        validateGenerateError(error);
    }
});

// WHATSAPP CONNECTION
client.on("change_state", (state) => {
    loggerDev.info("Whatsapp connection restarting...", state);
});

// WHATSAPP DISCONNECT
client.on("disconnected", async (reason) => {
    loggerDev.info("Whatsapp is disconnected!", reason);

    // IF CLIENT DISCONNECT & REMOVE SESSION
    fs.rmSync(`${SESSION_FILE_PATH}/session-${SESSION_CLIENT}`, { recursive: true, force: true });
    await client.destroy();
});

// WHATSAPP INITALIZE
client.initialize();

// LOGGER INFO PRODUCTION
app.use(expressWinston.logger(loggerProd));

// API
app.post("/whatsapp/send", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message = validateRequestParams(req.body.message, "any");
        const sender = validateRequestParams(req.body.sender, "num");

        if (!message || !sender) {
            return res.status(BadRequest).send(responseApiError(BadRequest, "parameter not valid!", [message, sender], "message or sender cannot be empty"));
        }

        const responseData = await sendRequestMessage(client, sender, message);

        return res.status(Ok).send(responseApiSuccess(Ok, "success", responseData.id));
    } catch (error) {
        next(error);
    }
});

// LOGGER ERROR PRODUCTION
app.use(expressWinston.errorLogger(loggerProd));

// MIDDLEWARE RESPONSE ERROR
app.use((err: any, req: Request, res: Response, next: NextFunction) => res.status(InternalServerError).send(responseApiError(InternalServerError, "internal server error!", [], "")));

// LISTENING API
app.listen(PROGRAM_PORT, () => loggerDev.info(`${PROGRAM_NAME} running on port ${PROGRAM_PORT}`));
