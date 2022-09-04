// Modules
import { Client, Message, MessageMedia } from "whatsapp-web.js";
import moment from "moment";
import crypto from "crypto";

// Interfaces
import { IResponseApiError, IResponseApiSuccess, ISendMessage, ITypeBuffer, ItypeChar, ItypeMoment, ITypeParams } from "./baseFunctions.interface";

// Providers
import models from "../../databases/models";
import { logger } from "../logs";

export const validateParams = (request: string, regExp: RegExp): string => {
    return request.replace(regExp, "");
};

export const validateRequestParams = (request: unknown, type: ITypeParams): string => {
    if (request && (typeof request === "string" || typeof request === "number")) {
        const requestString = request.toString();
        switch (type) {
            case "char":
                return validateParams(requestString, /[^a-z\d\s]+/gi);
            case "charSpace":
                return validateParams(requestString, /[^a-zA-Z]/g);
            case "num":
                return validateParams(requestString, /[^0-9]+/g);
            case "numChar":
                return validateParams(requestString, /[^a-zA-Z0-9]/g);
            case "numCharSpace":
                return validateParams(requestString, /[^\w\s]/gi);
            case "any":
                return requestString;
        }
    }
    return "";
};

export const validateRequestBuffer = (request: unknown, type: ITypeBuffer): string => {
    if (request && typeof request === "string") {
        switch (type) {
            case "encode":
                return Buffer.from(request).toString("base64");
            case "decode":
                return Buffer.from(request, "base64").toString("ascii");

            default:
                return "";
        }
    }

    return "";
};

export const validateRequestHp = (request: string): string => {
    if (!request) return "";

    const checkNumberHp = request.substring(0, 2);

    if (checkNumberHp === "62") return request + "@c.us";
    return request.replace(checkNumberHp, "628") + "@c.us";
};

export const validateRequestMoment = (request: Date, type: ItypeMoment): string => {
    switch (type) {
        case "date":
            return moment(request).format("YYYY-MM-DD");
        case "datetime":
            return moment(request).format("YYYY-MM-DD HH:mm:ss");
        case "datetime2":
            return moment(request).format("YYYYMMDDHHmmss");

        default:
            return "";
    }
};

export const validateRequestEmoji = (request: string): string => {
    if (!request) return "";

    return request.replace(/\p{Extended_Pictographic}/gu, (m: any, idx: any) => `[e-${m.codePointAt(0).toString(16)}]`);
};

export const validateRequestVariable = async (namespace: string, variable: string[]): Promise<string> => {
    try {
        let message = "";
        const getMessage = await models.templates.findOne({ namespace, status: 1 }).then((v) => v?.message ?? "");

        if (getMessage) {
            for (let index = 0; index < variable.length; index++) {
                message = getMessage.replace(`{{${index + 1}}}`, variable[index]);
            }
        }
        return message;
    } catch (error) {
        throw error;
    }
};

export const validateGenerateError = async (error: unknown): Promise<void> => {
    try {
        if (error) throw new Error(error as string);
    } catch (error) {
        logger.error(error);
    }
};

export const randomCharacters = (request: number, type: ItypeChar): string => {
    let characters = "";
    let charactersResult = "";

    switch (type) {
        case "alpha":
            characters = "qwertyuiopasdfghjklzxcvbnm";
            break;
        case "numeric":
            characters = "1234567890";
            break;
        case "alphanumeric":
            characters = "1234567890qwertyuiopasdfghjklzxcvbnm";
            break;
        default:
            break;
    }

    for (let index = 0; index < request; index++) {
        const random = Math.floor(Math.random() * characters.length);
        charactersResult += characters[random];
    }
    return charactersResult.toUpperCase();
};

export const randomHash = async (request: crypto.BinaryLike, encode: crypto.BinaryToTextEncoding): Promise<string> => {
    try {
        if (!request) return "";

        const randomStr = Math.random().toString(36).substring(7);
        const hash = crypto.createHash("sha256").update(request).digest(encode);

        const resultHash = `${hash}${randomStr}`;
        return resultHash;
    } catch (error) {
        throw error;
    }
};

export const randomInt = (request: number[]): number => {
    return Math.floor(Math.random() * request.length + 1);
};

export const sendRequestMessage = async (request: ISendMessage): Promise<Message | null> => {
    try {
        const { whatsappClient, sender, message, link } = request;

        if (whatsappClient instanceof Client) {
            return await whatsappClient.sendMessage(validateRequestHp(sender), message, link ? { media: await MessageMedia.fromUrl(link, { unsafeMime: true }) } : {});
        }
        return null;
    } catch (error) {
        throw error;
    }
};

export const responseApiError = (request: IResponseApiError): unknown => {
    const { code, message, params, detail } = request;
    return {
        apiVersion: "1.0",
        error: {
            code,
            message,
            errors: [{ params }],
            detail,
        },
    };
};

export const responseApiSuccess = (request: IResponseApiSuccess): unknown => {
    const { code, status, data } = request;
    return {
        apiVersion: "1.0",
        data: {
            code,
            status,
            data,
        },
    };
};
