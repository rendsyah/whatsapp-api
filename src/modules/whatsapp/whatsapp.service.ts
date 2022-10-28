// Modules
import { Client, Message, MessageMedia } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import fs from "fs";
import appRootPath from "app-root-path";

// Interfaces
import { IRequestMessageService, IRequestReplyService, IResponseWhatsappService } from "./whatsapp.interface";

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
import { connectQueue, replyQueue } from "./whatsapp.process";

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
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
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
        const whatsappClientName = whatsappClient.info.pushname;
        const whatsappClientPlatform = whatsappClient.info.platform;

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
        loggerDev.info(`Whatsapp client connected to ${whatsappClientName} from ${whatsappClientPlatform}`);
        loggerDev.info(`Whatsapp version ${whatsappVersion}`);
    });

    // Whatsapp Get Message
    whatsappClient.on("message", async (message): Promise<void> => {
        await whatsappConnectService(message);
    });

    // Whatsapp Get Status Message
    whatsappClient.on("message_ack", async (message): Promise<void> => {
        const to = validateRequestParams(message.to, "num");
        const _status = message.ack || 0;

        if (_status === 2) {
            await models.OutgoingLogs.updateMany({ to, _status: 1 }, { $set: { status: "sent", _status } });
        }

        if (_status === 3) {
            await models.OutgoingLogs.updateMany({ to, _status: { $in: [1, 2] } }, { $set: { status: "read", _status } });
        }
    });

    // Whatsapp Get Connection
    whatsappClient.on("change_state", async (state): Promise<void> => {
        if (state === "OPENING" || state === "PAIRING") {
            loggerDev.info("Whatsapp connection restarting...");
            setTimeout(async () => {
                await whatsappClient.resetState();
            }, +WHATSAPP_RESET_CONNECTION);
        }

        if (state === "CONNECTED") {
            loggerDev.info("Whatsapp connection connected");
        }
    });

    // Whatsapp Disconnected
    whatsappClient.on("disconnected", async (): Promise<void> => {
        loggerDev.info("Whatsapp disconnected");
        await whatsappClient.destroy();
        await whatsappClient.initialize();
    });
};

// Whatsapp Reply Service
export const whatsappReplyService = async (params: IRequestReplyService): Promise<IResponseWhatsappService> => {
    try {
        const { to, message, media, type, image } = params;

        await models.OutgoingLogs.create({
            from: WHATSAPP_PHONE_NUMBER,
            to: to,
            message: message,
            media: media,
            sentTime: validateRequestMoment(new Date(), "datetime"),
            type: type,
            _status: 1,
        });

        const responseData = image
            ? await whatsappClient.sendMessage(validateRequestHp(to), message, {
                  media: new MessageMedia("image/jpeg", image),
              })
            : await whatsappClient.sendMessage(validateRequestHp(to), message, { sendSeen: true });

        return { data: responseData.id };
    } catch (error) {
        throw error;
    }
};

// Whatsapp Message Services
export const whatsappMessageService = async (params: IRequestMessageService): Promise<IResponseWhatsappService> => {
    try {
        const { to, type, body } = params;
        const { message, image } = body;
        let filename = "";

        if (image) {
            const mediaName = `${validateRequestMoment(new Date(), "datetime2")}_${randomCharacters(5, "alphanumeric")}`;
            filename = `${mediaName}.jpeg`;

            fs.writeFile(`${appRootPath}/..${WHATSAPP_UPLOAD_PATH}${filename}`, image, "base64", (error) => {
                if (error) throw error;
            });
        }

        const requestReplyService: IRequestReplyService = {
            to: to,
            message: message,
            media: filename,
            type: type,
            image: image,
        };

        await replyQueue.add("Reply Process Queue", requestReplyService, {
            attempts: 3,
            backoff: 5000,
            timeout: 60000,
        });

        return { data: "ok" };
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

        if (!whatsappClient.isRegisteredUser(message.from)) {
            const requestReplyService: IRequestReplyService = {
                to: waSender,
                message: waMessage,
                media: "",
                type: message.type,
            };

            await replyQueue.add("Reply Process Queue", requestReplyService, {
                attempts: 3,
                backoff: 5000,
                timeout: 60000,
            });
        }

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
        validateGenerateError(error);
    }
};

// Whatsapp Download Service
const whatsappDownloadService = async (message: Message): Promise<string> => {
    try {
        const mediaFile = await message.downloadMedia();
        const mediaFileMimeType = mediaFile.mimetype?.split("/") ?? null;
        const mediaFileExtension = mediaFile.filename?.split(".")?.[1] ?? mediaFileMimeType?.[1];

        if (!mediaFileExtension) {
            throw new Error("download media failed");
        }

        const mediaName = `${validateRequestMoment(new Date(), "datetime2")}_${randomCharacters(5, "alphanumeric")}`;
        const mediaFilename = `${mediaName}.${mediaFileExtension}`;
        const mediaFilePath = `${appRootPath}/..${WHATSAPP_MEDIA_PATH}${mediaFilename}`;
        const mediaFileData = mediaFile.data;

        fs.writeFile(mediaFilePath, mediaFileData, "base64", (error) => {
            if (error) throw error;
        });

        return mediaFilename;
    } catch (error) {
        throw error;
    }
};
