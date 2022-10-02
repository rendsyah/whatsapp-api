// Modules
import moment from "moment";
import crypto from "crypto";

// Interfaces
import { IRequestDataError, IRequestDataSuccess, ITypeBuffer, ItypeChar, ItypeMoment, ITypeParams } from "./base.dto";

// Commons
import logger from "../logs";

export const validateParams = (request: string, regExp: RegExp): string => {
    return request.replace(regExp, "");
};

export const validateRequestParams = (request: string, type: ITypeParams): string => {
    if (!request) return "";

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
};

export const validateRequestBuffer = (request: string, type: ITypeBuffer): string => {
    if (!request) return "";

    switch (type) {
        case "encode":
            return Buffer.from(request).toString("base64");

        case "decode":
            return Buffer.from(request, "base64").toString("ascii");
    }
};

export const validateRequestHp = (request: string): string => {
    if (!request) return "";

    const checkNumberHp = request.substring(0, 2);

    if (checkNumberHp === "62") {
        return request + "@c.us";
    }

    return request.replace(checkNumberHp, "628") + "@c.us";
};

export const validateRequestMoment = (request: Date, type: ItypeMoment): string => {
    if (!moment(request).isValid()) return "";

    switch (type) {
        case "date":
            return moment(request).format("YYYY-MM-DD");

        case "datetime":
            return moment(request).format("YYYY-MM-DD HH:mm:ss");

        case "datetime2":
            return moment(request).format("YYYYMMDDHHmmss");
    }
};

export const validateRequestEmoji = (request: string): string => {
    if (!request) return "";

    return request.replace(/\p{Extended_Pictographic}/gu, (m: any, idx: any) => `[e-${m.codePointAt(0).toString(16)}]`);
};

export const validateGenerateError = (error: unknown): void => {
    logger.error(error);
};

export const randomCharacters = (request: number, type: ItypeChar): string => {
    if (!request) return "";

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
    }

    for (let index = 0; index < request; index++) {
        const random = Math.floor(Math.random() * characters.length);
        charactersResult += characters[random];
    }

    return charactersResult.toUpperCase();
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

export const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * max + min);
};

export const responseApiError = (request: IRequestDataError): unknown => {
    const { code, status, params, detail } = request;

    return {
        apiVersion: "1.0",
        error: {
            code,
            status,
            errors: [{ params: [params] }],
            detail,
        },
    };
};

export const responseApiSuccess = (request: IRequestDataSuccess): unknown => {
    const { code, status, data } = request;

    return {
        apiVersion: "1.0",
        data: {
            code,
            status,
            ...data,
        },
    };
};
