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
import {
    validateRequestParams,
    validateRequestHp,
    validateRequestBuffer,
    validateGenerateError,
    validateRequestMoment,
    validateRequestEmoji,
    randomCharacters,
} from "../../config/lib/baseFunctions";
import models from "../../databases/models";

// Processes
import { connectQueue, messageQueue } from "./whatsapp.process";

// Whatsapp Environments
const WHATSAPP_PHONE_NUMBER = process.env.WHATSAPP_PHONE_NUMBER as string;
const WHATSAPP_SESSION_CLIENT = process.env.WHATSAPP_SESSION_CLIENT as string;
const WHATSAPP_SESSION_PATH = process.env.WHATSAPP_SESSION_PATH as string;
const WHATSAPP_MEDIA_PATH = process.env.WHATSAPP_MEDIA_PATH as string;
const WHATSAPP_UPLOAD_PATH = process.env.WHATSAPP_UPLOAD_PATH as string;
const WHATSAPP_RESET_CONNECTION = process.env.WHATSAPP_RESET_CONNECTION as string;

// Whatsapp Client
export const whatsappClient = new Client({
    puppeteer: {
        headless: true,
    },
    qrMaxRetries: 10000,
    authStrategy: whatsappAuth(WHATSAPP_SESSION_CLIENT, WHATSAPP_SESSION_PATH),
});

// Whatsapp Initialization Service
export const whatsappService = (): void => {
    // Whatsapp Initialize
    whatsappClient.initialize();

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
            const whatsappDirectory: readonly any[] = [
                {
                    name: "media",
                    path: `${appRootPath}/..${WHATSAPP_MEDIA_PATH}`,
                },
                {
                    name: "uploads",
                    path: `${appRootPath}/..${WHATSAPP_UPLOAD_PATH}`,
                },
            ];

            whatsappDirectory.forEach((v, i) => {
                fs.mkdir(v.path, { recursive: true }, (error) => {
                    if (error) validateGenerateError(error);
                    loggerDev.info(`Whatsapp ${v.name} directory has been created`);
                });
            });
        }

        loggerDev.info("Whatsapp connection ready");
        loggerDev.info(`Whatsapp connected on ${whatsappClient.info.pushname}`);
        loggerDev.info(`Whatsapp version ${whatsappVersion}`);
    });

    // Whatsapp Get Message
    whatsappClient.on("message", async (message): Promise<void> => {
        await whatsappConnectService(message);
    });

    // Whatsapp Get Status Message
    whatsappClient.on("message_ack", async (message): Promise<void> => {
        const to = validateRequestParams(message.to, "num");
        const _status = message.ack;

        if (_status === 2) {
            await models.OutgoingLogs.updateMany({ to, _status: 1 }, { $set: { status: "sent", _status } });
        }

        if (_status === 3) {
            await models.OutgoingLogs.updateMany({ to, _status: { $in: [1, 2] } }, { $set: { status: "read", _status } });
        }
    });

    // Whatsapp Get Connection
    whatsappClient.on("change_state", async (state): Promise<void> => {
        if (state === "OPENING") {
            loggerDev.info("Whatsapp connection restarting...");
        }

        if (state === "PAIRING") {
            setTimeout(async () => {
                await whatsappClient.resetState();
            }, +WHATSAPP_RESET_CONNECTION);

            loggerDev.info("Whatsapp connection pairing...");
        }

        if (state === "CONNECTED") {
            loggerDev.info("Whatsapp connection connected");
        }
    });

    // Whatsapp Disconnected
    whatsappClient.on("disconnected", async (): Promise<void> => {
        await whatsappClient.destroy();

        loggerDev.info("Whatsapp session closed...");
        whatsappClient.initialize();
    });
};

// Whatsapp Reply Service
export const whatsappReplyService = async (params: IRequestReplyMessageService): Promise<Message> => {
    try {
        const { to, type, body } = params;

        let responseData: any;
        if (type === "text/individual") {
            responseData = await whatsappClient.sendMessage(validateRequestHp(to), body.message);
        }

        if (type === "text-image/individual") {
            responseData = await whatsappClient.sendMessage(validateRequestHp(to), body.message, {
                media: await MessageMedia.fromUrl(body.link as string, { unsafeMime: true }),
            });
        }

        await models.OutgoingLogs.create({
            from: WHATSAPP_PHONE_NUMBER,
            to: to,
            message: body.message,
            media: body.link ? body.link : "",
            sentTime: validateRequestMoment(new Date(), "datetime"),
            type: type,
            _status: 1,
        });

        return responseData?.id;
    } catch (error) {
        throw error;
    }
};

// Whatsapp Message Services
export const whatsappMessageService = async (params: IRequestReplyMessageService): Promise<IResponseWhatsappService> => {
    try {
        const responseQueue = await messageQueue.add("Message Process Queue", { ...params });
        const responseData = await responseQueue.finished();

        if (!responseData) {
            throw new Error("sending message failed, try again");
        }

        return { data: responseData };
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
        const waMedia = validateRequestParams(message.hasMedia ? await whatsappDownloadService(message) : "", "any");
        const waSender = validateRequestParams(message.from, "num");
        const waTimestamp = validateRequestMoment(new Date(), "datetime");

        await models.Incominglogs.create({
            from: waSender,
            to: WHATSAPP_PHONE_NUMBER,
            message: waMessage,
            media: waMedia,
            receivedTime: waTimestamp,
            type: message.type,
            device: message.deviceType,
            status: "received",
        });

        const requestConnectService = {
            name: waName,
            message: validateRequestBuffer(waMessage, "encode"),
            sender: waSender,
            media: 300,
            rcvdTime: waTimestamp,
            photo: validateRequestBuffer(waMedia, "encode"),
        };

        await connectQueue.add("Connect Process Queue", requestConnectService, { attempts: 10, backoff: 5000, timeout: 60000 });
    } catch (error) {
        console.log(error);
        validateGenerateError(error);
    }
};

// Whatsapp Download Service
const whatsappDownloadService = async (message: Message): Promise<string> => {
    try {
        const mediaFile = await message.downloadMedia();
        const mediaFileMimeType = mediaFile.mimetype?.split("/") ?? null;
        const mediaFileType = mediaFileMimeType?.[0];
        const mediaFileExtension = mediaFile.filename?.split(".")?.[1] ?? mediaFileMimeType?.[1];
        const mediaFileDirectory = IRequestMediaType[mediaFileType as keyof typeof IRequestMediaType];

        if (!mediaFileExtension || !mediaFileDirectory) {
            throw new Error("download media failed");
        }

        const mediaName = `${validateRequestMoment(new Date(), "datetime2")}_${randomCharacters(5, "alphanumeric")}`;
        const mediaFilename = `${mediaName}.${mediaFileExtension}`;
        const mediaFileCheckPath = `${appRootPath}/..${WHATSAPP_MEDIA_PATH}${mediaFileDirectory}`;
        const mediaFilePath = `${mediaFileCheckPath}${mediaFilename}`;
        const mediaFileData = mediaFile.data;

        if (!fs.existsSync(mediaFileCheckPath)) {
            fs.mkdir(mediaFileCheckPath, { recursive: true }, (error) => {
                if (error) throw error;
                loggerDev.info(`Whatsapp ${mediaFileDirectory} directory has been created!`);
            });
        }

        fs.writeFile(mediaFilePath, mediaFileData, "base64", (error) => {
            if (error) throw error;
        });

        return mediaFilename;
    } catch (error) {
        throw error;
    }
};
