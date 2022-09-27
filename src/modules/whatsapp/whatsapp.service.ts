// Modules
import { Client, Message, MessageMedia } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import fs from "fs";
import appRootPath from "app-root-path";

// Interfaces
import { IRequestMediaType, IRequestReplyMessageService, IResponseWhatsappService } from "./whatsapp.dto";

// Commons
import { whatsappAuth } from "../../middlewares";
import { loggerDev } from "../../config/logs/logger.development";
import { BadRequestException } from "../../config/lib/baseClasses";
import {
    validateRequestParams,
    validateRequestHp,
    validateRequestBuffer,
    validateGenerateError,
    validateRequestMoment,
    validateRequestEmoji,
    randomCharacters,
} from "../../config/lib/baseFunctions";

// Processes
import { whatsappConnectQueue, whatsappMessageQueue } from "./whatsapp.process";

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

// Whatsapp Connect Service
const whatsappConnectService = async (message: Message): Promise<void> => {
    try {
        const waContact = await message.getContact();
        const waName = validateRequestParams(validateRequestEmoji(waContact.pushname), "any");
        const waMessage = validateRequestParams(message.body, "any");
        const waMedia = validateRequestParams(message.hasMedia ? await whatsappDownloadService(message) : "", "any");
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

        const processQueue = whatsappConnectQueue();

        await processQueue.add("Connect Process Queue", requestConnectService, { attempts: 10, backoff: 5000, timeout: 60000 });
    } catch (error) {
        validateGenerateError(error);
    }
};

// Whatsapp Download Service
const whatsappDownloadService = async (message: Message): Promise<string> => {
    try {
        const mediaFile = await message.downloadMedia();
        const mediaFileMimeType = mediaFile.mimetype?.split("/");
        const mediaFileType = mediaFileMimeType[0] || "";
        const mediaFileExtension = mediaFile.filename?.split(".")[1] || mediaFileMimeType[1] || "";
        const mediaFileDirectory = IRequestMediaType[mediaFileType as keyof typeof IRequestMediaType] || "";

        if (!mediaFileExtension || !mediaFileDirectory) return "";

        const mediaFilename = `${validateRequestMoment(new Date(), "datetime2")}_${randomCharacters(5, "alphanumeric")}.${mediaFileExtension}`;
        const mediaFileCheckPath = `${appRootPath}/..${WHATSAPP_MEDIA_PATH}${mediaFileDirectory}`;
        const mediaFilePath = `${mediaFileCheckPath}${mediaFilename}`;
        const mediaFileData = mediaFile.data;

        if (!fs.existsSync(mediaFileCheckPath)) {
            fs.mkdir(mediaFileCheckPath, { recursive: true }, (error) => {
                if (error) validateGenerateError(error);
                loggerDev.info(`Whatsapp ${mediaFileDirectory} directory has been created!`);
            });
        }

        fs.writeFile(mediaFilePath, mediaFileData, "base64", (error) => {
            if (error) validateGenerateError(error);
        });

        return mediaFilename;
    } catch (error) {
        throw error;
    }
};

// Whatsapp Initialization Service
export const whatsappService = (): void => {
    // Whatsapp Generate QR Code
    whatsappClient.on("qr", async (qr): Promise<void> => {
        loggerDev.info("Whatsapp QR Code received");
        qrcode.generate(qr, { small: true });
    });

    // Whatsapp Authentication
    whatsappClient.on("authenticated", async (): Promise<void> => {
        loggerDev.info("Whatsapp authentication success");
    });

    // Whatsapp Connected
    whatsappClient.on("ready", async (): Promise<void> => {
        const whatsappVersion = await whatsappClient.getWWebVersion();

        if (!fs.existsSync(`${appRootPath}/..${WHATSAPP_MEDIA_PATH}` && `${appRootPath}/..${WHATSAPP_UPLOAD_PATH}`)) {
            const folders: readonly string[] = [`${appRootPath}/..${WHATSAPP_MEDIA_PATH}`, `${appRootPath}/..${WHATSAPP_UPLOAD_PATH}`];
            folders.forEach((path, i) => {
                fs.mkdir(path, { recursive: true }, (error) => {
                    if (error) validateGenerateError(error);
                    loggerDev.info(`Whatsapp ${!i ? "media" : "upload"} directory has been created`);
                });
            });
        }

        loggerDev.info("Whatsapp is connected");
        loggerDev.info(`Whatsapp version ${whatsappVersion}`);
    });

    // Whatsapp Get Message
    whatsappClient.on("message", async (message): Promise<void> => {
        await whatsappConnectService(message);
    });

    // Whatsapp Check Connection
    whatsappClient.on("change_state", async (state): Promise<void> => {
        if (state === "OPENING") {
            loggerDev.info("Whatsapp connection restarting...");
        }
        if (state === "PAIRING") {
            loggerDev.info("Whatsapp connection pairing...");
        }
        if (state === "CONNECTED") {
            loggerDev.info("Whatsapp connection is connected");
        }
    });

    // Whatsapp Disconnected
    whatsappClient.on("disconnected", async (): Promise<void> => {
        await whatsappClient.destroy();
        loggerDev.info("Whatsapp is disconnected");
    });

    // Whatsapp Initialize
    whatsappClient.initialize();
};

// Whatsapp Reply Service
export const whatsappReplyService = async (params: IRequestReplyMessageService): Promise<unknown> => {
    try {
        const { to, type, body, components } = params;
        let responseData: Message;

        switch (type) {
            case "text/individual":
                responseData = await whatsappClient.sendMessage(validateRequestHp(to), body.message);
                return responseData?.id;

            case "text-image/individual":
                if (body.link) {
                    responseData = await whatsappClient.sendMessage(validateRequestHp(to), body.message, {
                        media: await MessageMedia.fromUrl(body.link, { unsafeMime: true }),
                    });
                    return responseData?.id;
                }

            case "template/individual":
                if (components) {
                    const [{ type, parameters }] = components;
                    // return;
                }

            default:
                throw new BadRequestException("type", "type is not exists");
        }
    } catch (error) {
        throw error;
    }
};

// Whatsapp Message Services
export const whatsappMessageService = async (params: IRequestReplyMessageService): Promise<IResponseWhatsappService> => {
    try {
        const { to, type, body, components } = params;

        const requestReplyService: IRequestReplyMessageService = {
            to,
            type,
            body,
            components,
        };

        const processQueue = whatsappMessageQueue();
        const responseQueue = await processQueue.add("Message Process Queue", requestReplyService);
        const responseData = await responseQueue.finished();

        if (!responseData) {
            throw new Error("sending message failed, try again");
        }

        return { data: responseData };
    } catch (error) {
        throw error;
    }
};
