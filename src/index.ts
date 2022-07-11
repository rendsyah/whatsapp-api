import express, { Request, Response, NextFunction } from "express";
import { Client, MessageMedia } from "whatsapp-web.js";
import dotenv from "dotenv";
import cors from "cors";
import qrcode from "qrcode-terminal";
import fs from "fs";
import appRoot from "app-root-path";
import path from "path";

dotenv.config();

// LOGGER
import { logger } from "./config/logger";

// MIDDLEWARE
import { authWA } from "./middlewares/auth/authWA";

// LIBARY
import { validateRequestParams, validateRequestHp, validateRequestBuffer, validateGenerateError, validateRequestMoment, validateRequestEmoji, randomString, randomHash } from "./lib/baseFunctions";

const app = express();

// CONFIG ENVIRONMENT
const PROGRAM_PORT = process.env.PROGRAM_PORT;
const PROGRAM_NAME = process.env.PROGRAM_NAME;

// CONFIG SESSION
const SESSION_CLIENT = process.env.SESSION_CLIENT ?? "";
const SESSION_FILE_PATH = process.env.SESSION_FILE_PATH ?? "";

// CONFIG MEDIA
const MEDIA_PATH = process.env.MEDIA_PATH ?? "";
const MEDIA_LIMIT_MB = process.env.MEDIA_LIMIT_MB ?? 0;

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

            const mediaFilename = randomHash(mediaAttachment.filename ?? "", "base64") || `${validateRequestMoment(new Date(), "datetime2")}_${randomString(5)}`;
            const mediaData = validateRequestParams(mediaAttachment.data, "any");
            const media = `${mediaFilename}.${mediaExtension}`;

            // GROUPING MEDIA TYPES
            enum MediaTypes {
                image = "image",
                video = "video",
                application = "docs",
            }

            const mediaDirectory = MediaTypes[mediaType as keyof typeof MediaTypes];

            // CHECK MEDIA DIRECTORY
            if (!fs.existsSync(`${appRoot}${MEDIA_PATH}${mediaDirectory}`)) {
                fs.mkdir(`${appRoot}${MEDIA_PATH}${mediaDirectory}`, { recursive: true }, (error) => {
                    if (error) validateGenerateError(error);
                    logger.info("Whatsapp directory media has been created!");
                });
            }

            // CHECK RECEIVED MEDIA (IMAGE, VIDEO, DOCS)
            if (mediaType in MediaTypes) {
                const mediaAllowed: RegExp = /png|jpe?g|webp|mp4|pdf/i;
                const mediaCheck = mediaAllowed.test(path.extname(media));

                // SEND MESSAGE IF EXTENSION NOT ALLOWED
                if (!mediaCheck) {
                    logger.info("media extension not allowed!");
                    return;
                }

                // STORE MEDIA TO DIRECTORY
                fs.writeFile(`${appRoot}${MEDIA_PATH}${mediaDirectory}/${media}`, mediaData, "base64", (error) => {
                    if (error) validateGenerateError(error);

                    // CHECK MEDIA SIZE
                    fs.stat(`${appRoot}${MEDIA_PATH}${mediaDirectory}/${media}`, (error, stats) => {
                        if (error) validateGenerateError(error);

                        const mediaSize = stats.size;
                        const mediaLimit = mediaSize > +MEDIA_LIMIT_MB;

                        if (mediaLimit) {
                            fs.rmSync(`${appRoot}${MEDIA_PATH}${mediaDirectory}/${media}`, { recursive: true });
                            logger.info("Whatsapp media greater than limit(10mb)");
                            return;
                        }

                        logger.info("Whatsapp media has been downloaded!");
                        waMedia = media;
                    });
                });
            }
        }

        // SEND TEST MESSAGE
        // await client.sendMessage(`Hallo, ${waName}`)

        // SEND REQUEST WHATSAPP AND GET RESPONSE DATA
        // const responseRequestWhatsapp = await sendRequestWhatsapp({ waMessage, waSender, waTimestamp });

        // SEND REQUEST WHATSAPP WITH MEDIA AND GET RESPONSE DATA
        // const responseRequestWhatsapp = await sendRequestWhatsapp({ waMessage, waSender, waMedia, waTimestamp });

        // const { status, data } = responseRequestWhatsapp;
        // const {sender, message, image} = data;

        // CHECK STATUS ERROR
        // if (status >= 400) {
        //     validateGenerateError(message, status)
        // }

        // SEND WITH MESSAGE
        // await client.sendMessage(validateRequestHp(sender, "waGateway"), message);

        // SEND WITH MESSAGE & MEDIA
        // await client.sendMessage(validateRequestHp(sender, "waGateway"), message, { media: MessageMedia.fromFilePath(`${appRoot}${MEDIA_PATH}${mediaDirectory}/${image}`) });
    } catch (error) {
        validateGenerateError(error);
    }
});

// WHATSAPP CONNECTION
client.on("change_state", (state) => {
    logger.info("Whatsapp connection", state);
});

// WHATSAPP DISCONNECT
client.on("disconnected", async (reason) => {
    logger.info("Whatsapp is disconnected!", reason);

    // IF CLIENT DISCONNECT REMOVE SESSION
    fs.rmSync(SESSION_FILE_PATH, { recursive: true, force: true });
    await client.destroy();
});

// WHATSAPP INITALIZE
client.initialize();

app.post("/whatsapp/send", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message = validateRequestParams(req.body.message, "any");
        const sender = validateRequestHp(req.body.sender, "waGateway");

        if (!message || !sender) {
            return res.status(400).send({
                statusCode: 400,
                message: "Parameter not valid!",
            });
        }

        const responseWhatsapp = await client.sendMessage(sender, message);

        if (!responseWhatsapp.fromMe) {
            return res.status(500).send({
                statusCode: 500,
                message: "Server error!",
            });
        }

        return res.status(200).send({
            statusCode: 200,
            data: {},
        });
    } catch (error) {
        next(error);
    }
});

app.get("/whatsapp/blast", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const waContact: any = [];
        let waMessage: string;

        for (let i = 0; i < waContact.length; i++) {
            const phone = waContact[i].phone;
            setTimeout(async () => await client.sendMessage(phone, waMessage), 40000, i);
        }
    } catch (error) {
        next(error);
    }
});

// MIDDLEWARE RESPONSE ERROR
app.use((err: any, req: Request, res: Response, next: NextFunction) => res.status(500).send({ message: "internal server error!" }));

// LISTENING API
app.listen(PROGRAM_PORT, () => logger.info(`${PROGRAM_NAME} is connected!`));
