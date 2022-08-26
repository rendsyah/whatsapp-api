import { Client, Message } from "whatsapp-web.js";
import moment from "moment";
import crypto from "crypto";

import { ITypeBuffer, ItypeMoment, ITypeParams } from "./interfaces/baseFunctions.interface";
import logger from "../logs";

export const validateParams = (request: string, regExp: RegExp): string => {
    return request.replace(regExp, "").trim();
};

export const validateRequestParams = (request: unknown, type: ITypeParams): string => {
    if (request && typeof request === "string") {
        switch (type) {
            case "char":
                return validateParams(request, /[^a-z\d\s]+/gi);
            case "charSpace":
                return validateParams(request, /[^a-zA-Z]/g);
            case "num":
                return validateParams(request, /[^0-9]+/g);
            case "numChar":
                return validateParams(request, /[^a-zA-Z0-9]/g);
            case "numCharSpace":
                return validateParams(request, /[^\w\s]/gi);
            case "any":
                return request;
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
                return Buffer.from(request, "base64").toString("ascii").toUpperCase();

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

export const randomString = (request: number): string => {
    const char = "1234567890qwertyuiopasdfghjklzxcvbnm";
    let result = "";

    for (let index = 0; index < request; index++) {
        const random = Math.floor(Math.random() * char.length);
        result += char[random];
    }

    return result.toUpperCase();
};

export const validateGenerateError = async (error: unknown): Promise<void> => {
    try {
        if (error) throw new Error(error as string);
    } catch (error) {
        logger.error(error);
    }
};

export const randomHash = async (request: crypto.BinaryLike, encode: crypto.BinaryToTextEncoding): Promise<string> => {
    if (!request) return "";

    try {
        const randomStr = Math.random().toString(36).substring(7);
        const hash = crypto.createHash("sha256").update(request).digest(encode);

        const resultHash = `${hash}${randomStr}`;
        return resultHash;
    } catch (error) {
        throw error;
    }
};

export const randomInt = (...request: number[]): number => {
    return Math.floor(Math.random() * request.length + 1);
};

export const sendRequestMessage = async (client: Client, sender: string, message: string): Promise<Message> => {
    return await client.sendMessage(validateRequestHp(sender), message);
};

export const responseApiError = (status: number, message: string, params: (string | number)[] = [], detail: string): unknown => {
    return {
        apiVersion: "1.0",
        error: {
            code: status,
            message: message,
            errors: [{ params: params }],
            detail: detail,
        },
    };
};

export const responseApiSuccess = (status: number, message: string, data: unknown = {}): unknown => {
    return {
        apiVersion: "1.0",
        data: {
            code: status,
            message: message,
            data: data,
        },
    };
};
