// Modules
import { Client, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import fs from "fs";
import appRootPath from "app-root-path";

// Interfaces
import { IWhatsappMediaTypes } from "./whatsapp.interface";

// Commons
import { whatsappAuth } from "../middlewares";
import { loggerDev } from "../config/logs/logger";
import { validateRequestParams, validateRequestBuffer, validateGenerateError, validateRequestMoment, validateRequestEmoji, randomCharacters } from "../config/lib/baseFunctions";

// Processor
import { queues } from "./whatsapp.process";

// Whatsapp Environments
const WHATSAPP_SESSION_CLIENT = process.env.WHATSAPP_SESSION_CLIENT as string;
const WHATSAPP_SESSION_PATH = process.env.WHATSAPP_SESSION_PATH as string;
const WHATSAPP_MEDIA_PATH = process.env.WHATSAPP_MEDIA_PATH as string;
const WHATSAPP_UPLOAD_PATH = process.env.WHATSAPP_UPLOAD_PATH as string;

// Whatsapp Client
export const whatsappClient = new Client({
    puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true,
    },
    takeoverTimeoutMs: 10000,
    qrMaxRetries: 10000,
    authStrategy: whatsappAuth(WHATSAPP_SESSION_CLIENT, WHATSAPP_SESSION_PATH),
});

// Whatsapp Initialization Service
export const whatsappService = (): void => {
    // Whatsapp Restore Auth Session
    if (fs.existsSync(`${appRootPath}${WHATSAPP_SESSION_PATH}`)) {
        loggerDev.info("Whatsapp restoring session...");
    }

    // Whatsapp Generate QR Code
    whatsappClient.on("qr", (qr) => {
        loggerDev.info("Whatsapp QR Code received");
        qrcode.generate(qr, { small: true });
    });

    // Whatsapp Connected
    whatsappClient.on("ready", async () => {
        const whatsappVersion = await whatsappClient.getWWebVersion();

        if (!fs.existsSync(`${appRootPath}/..${WHATSAPP_MEDIA_PATH}` && `${appRootPath}/..${WHATSAPP_UPLOAD_PATH}`)) {
            const folders: readonly string[] = [`${appRootPath}/..${WHATSAPP_MEDIA_PATH}`, `${appRootPath}/..${WHATSAPP_UPLOAD_PATH}`];
            folders.forEach((path, i) => {
                fs.mkdir(path, { recursive: true }, async (error) => {
                    if (error) await validateGenerateError(error);
                    loggerDev.info(`Whatsapp ${!i ? "media" : "upload"} directory has been created`);
                });
            });
        }

        loggerDev.info("Whatsapp is connected");
        loggerDev.info(`Whatsapp version ${whatsappVersion}`);
    });

    // Whatsapp Authentication
    whatsappClient.on("authenticated", () => {
        loggerDev.info("Whatsapp authentication success");
    });

    // Whatsapp Get Message
    whatsappClient.on("message", async (message) => {
        await whatsappConnectService(message);
    });

    // Whatsapp Check Connection
    whatsappClient.on("change_state", (state) => {
        if (state === "OPENING") {
            loggerDev.info("Whatsapp connection restarting...");
        }
        if (state === "PAIRING") {
            loggerDev.info("Whatsapp connection pairing...");
        }
        if (state === "CONNECTED") {
            loggerDev.info("Whatsapp connection connected");
        }
    });

    // Whatsapp Disconnected
    whatsappClient.on("disconnected", async () => {
        loggerDev.info("Whatsapp is disconnected");
        await whatsappClient.destroy();
    });

    // Whatsapp Initialize
    whatsappClient.initialize();
};

// Whatsapp Connect Service
const whatsappConnectService = async (message: Message): Promise<void> => {
    try {
        const waContact = await message.getContact();
        const waName = validateRequestParams(validateRequestEmoji(waContact.pushname), "any");
        const waMessage = validateRequestParams(message.body, "any");
        const waMedia = validateRequestParams(message.hasMedia ? await whatsappDownloadService(message) : null, "any");
        const waSender = validateRequestParams(message.from, "num");
        const waTimestamp = validateRequestMoment(new Date(), "datetime");

        const requestConnectService = {
            name: waName,
            message: validateRequestBuffer(waMessage, "encode"),
            sender: waSender,
            media: "300",
            rcvdTime: waTimestamp,
            photo: validateRequestBuffer(waMedia, "encode"),
        };

        await queues.connectQueue.add("connectApi", requestConnectService);
    } catch (error) {
        await validateGenerateError(error);
    }
};

// Whatsapp Download Service
const whatsappDownloadService = async (message: Message): Promise<string | unknown> => {
    try {
        const mediaFile = await message.downloadMedia();
        const mediaFileMimeType = mediaFile.mimetype.split("/");
        const mediaFileType = mediaFileMimeType[0];
        const mediaFileExtension = mediaFile.filename?.split(".")[1] ?? mediaFileMimeType[1];
        const mediaDirectory = IWhatsappMediaTypes[mediaFileType as keyof typeof IWhatsappMediaTypes];

        const mediaFilename = `${validateRequestMoment(new Date(), "datetime2")}_${randomCharacters(5, "alphanumeric")}`;
        const mediaFileData = mediaFile.data;
        const media = `${mediaFilename}.${mediaFileExtension}`;

        if (!fs.existsSync(`${appRootPath}/..${WHATSAPP_MEDIA_PATH}${mediaDirectory}`)) {
            fs.mkdir(`${appRootPath}/..${WHATSAPP_MEDIA_PATH}${mediaDirectory}`, { recursive: true }, async (error) => {
                if (error) await validateGenerateError(error);
                loggerDev.info(`Whatsapp ${mediaDirectory} directory has been created!`);
            });
        }

        fs.writeFile(`${appRootPath}/..${WHATSAPP_MEDIA_PATH}${mediaDirectory}${media}`, mediaFileData, "base64", async (error) => {
            if (error) await validateGenerateError(error);
            return true;
        });

        return media;
    } catch (error) {
        await validateGenerateError(error);
    }
};
