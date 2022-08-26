import { Client, Message, MessageMedia } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import fs from "fs";
import appRoot from "app-root-path";

import { IWhatsappBroadcast, IWhatsappMediaTypes, IWhatsappMessage } from "./interface/whatsapp.interface";
import { loggerDev } from "../config/logs/logger";
import { whatsappAuth } from "../middlewares";
import {
    validateRequestParams,
    validateRequestHp,
    validateRequestBuffer,
    validateGenerateError,
    validateRequestMoment,
    validateRequestEmoji,
    randomString,
    sendRequestMessage,
} from "../config/lib/baseFunctions";
import axios from "../config/interceptors/axios";

// Config Service
const WHATSAPP_SESSION_CLIENT = process.env.WHATSAPP_SESSION_CLIENT as string;
const WHATSAPP_SESSION_PATH = process.env.WHATSAPP_SESSION_PATH as string;
const WHATSAPP_MEDIA_PATH = process.env.WHATSAPP_MEDIA_PATH as string;
const WHATSAPP_UPLOAD_PATH = process.env.WHATSAPP_UPLOAD_PATH as string;
const WHATSAPP_API_CONNECT = process.env.WHATSAPP_API_CONNECT as string;

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
    if (fs.existsSync(`${appRoot}${WHATSAPP_SESSION_PATH}`)) {
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

        if (!fs.existsSync(`${appRoot}/..${WHATSAPP_MEDIA_PATH}` && `${appRoot}/..${WHATSAPP_UPLOAD_PATH}`)) {
            const folders: readonly string[] = [`${appRoot}/..${WHATSAPP_MEDIA_PATH}`, `${appRoot}/..${WHATSAPP_UPLOAD_PATH}`];
            folders.forEach((path, i) => {
                fs.mkdir(path, { recursive: true }, async (error) => {
                    if (error) await validateGenerateError(error);
                    loggerDev.info(`Whatsapp ${i === 0 ? "media" : "upload"} directory has been created!`);
                });
            });
        }

        loggerDev.info("Whatsapp is connected!");
        loggerDev.info(`Whatsapp version ${whatsappVersion}`);
    });

    // Whatsapp Authentication
    whatsappClient.on("authenticated", () => {
        loggerDev.info("Whatsapp authentication success!");
    });

    // Whatsapp Get Message
    whatsappClient.on("message", async (message) => {
        await whatsappConnectService(message);
    });

    // Whatsapp Check Connection
    whatsappClient.on("change_state", () => {
        loggerDev.info("Whatsapp connection restarting...");
    });

    // Whatsapp Disconnected
    whatsappClient.on("disconnected", async () => {
        loggerDev.info("Whatsapp is disconnected!");

        // If whatsappClient Disconnect & Remove Session
        fs.rmSync(`${appRoot}${WHATSAPP_SESSION_PATH}/session`, { recursive: true, force: true });
        await whatsappClient.destroy();
    });

    // Whatsapp Initialize
    whatsappClient.initialize();
};

// Whatsapp Message Service
export const whatsappMessageService = async (params: IWhatsappMessage): Promise<unknown> => {
    try {
        const { sender, message, link } = params;

        let responseData: Message;

        if (link) {
            responseData = await whatsappClient.sendMessage(validateRequestHp(sender), message, { media: await MessageMedia.fromUrl(link, { unsafeMime: true }) });
        } else {
            responseData = await sendRequestMessage(whatsappClient, sender, message);
        }

        return responseData.id;
    } catch (error) {
        throw error;
    }
};

// Whatsapp Broadcast Service
export const whatsappBroadcastService = async (params: IWhatsappBroadcast): Promise<unknown> => {
    try {
        const { filename } = params;

        const fileStream = fs.readFile(`${appRoot}/..${WHATSAPP_UPLOAD_PATH}${filename}`, "utf8", (error, data) => {
            if (error) throw new Error(error.message);
            return data;
        });

        return "";
    } catch (error) {
        throw error;
    }
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

        const requestData = {
            name: waName,
            message: validateRequestBuffer(waMessage, "encode"),
            sender: waSender,
            media: "300",
            rcvdTime: waTimestamp,
            sessionId: validateRequestBuffer(waMessage, "encode"),
        };

        const responseData = await axios.post(WHATSAPP_API_CONNECT, requestData);

        // const responseData = await axios.get(`${WHATSAPP_API_CONNECT}?name=${waName}&sender=${waSender}&message=${waMessage}&timestamp=${waTimestamp}`);

        await sendRequestMessage(whatsappClient, waSender, responseData.data?.message);
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

        const mediaFilename = `${validateRequestMoment(new Date(), "datetime2")}_${randomString(5)}`;
        const mediaFileData = mediaFile.data;
        const media = `${mediaFilename}.${mediaFileExtension}`;

        // Check Media Directory
        if (!fs.existsSync(`${appRoot}/..${WHATSAPP_MEDIA_PATH}${mediaDirectory}`)) {
            fs.mkdir(`${appRoot}/..${WHATSAPP_MEDIA_PATH}${mediaDirectory}`, { recursive: true }, (error) => {
                if (error) validateGenerateError(error);
                loggerDev.info(`Whatsapp ${mediaDirectory} directory has been created!`);
            });
        }

        // Store Media To Directory
        fs.writeFile(`${appRoot}/..${WHATSAPP_MEDIA_PATH}${mediaDirectory}${media}`, mediaFileData, "base64", async (error) => {
            if (error) await validateGenerateError(error);
            return true;
        });

        return media;
    } catch (error) {
        validateGenerateError(error);
    }
};
