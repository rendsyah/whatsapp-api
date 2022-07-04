import moment from "moment";
import crypto from "crypto";

export const validateParams = (request: string, regExp: RegExp, changeValue?: string): string => {
    if (changeValue) return request.toString().replace(regExp, changeValue);
    return request.toString().replace(regExp, "").toUpperCase().trim();
};

export const validateRequestParams = (request: any, type: string): string => {
    if (!request) return "";

    switch (type) {
        case "char":
            return validateParams(request, /[^a-z\d\s]+/gi);
        case "charSpace":
            return validateParams(request, /[^a-zA-Z]/g);
        case "charConvert":
            const checkRequestLength = request.match(/[_*]/g) ?? [];

            if (checkRequestLength.length > 0) {
                const message = checkRequestLength.map((v: string) => {
                    if (v === "_") return request;
                    return validateParams(request, /\*/g, "#");
                });
                return message[0];
            }
            return request;
        case "num":
            return validateParams(request, /[^0-9]+/g);
        case "numChar":
            return validateParams(request, /[^a-zA-Z0-9]/g);
        case "numCharSpace":
            return validateParams(request, /[^\w\s]/gi);
        case "rcvd":
            return validateRequestMoment(request, "date");
        case "rcvdTime":
            return validateRequestMoment(request, "datetime");
        case "rcvdTimeConvert":
            return validateRequestMoment(request, "datetimeConvert");
        case "ip":
            if (request.connection) return request.connection.remoteAddress?.toString();
            return request?.["x-forwarded-for"].toString();
        case "any":
            return request;

        default:
            return "";
    }
};

export const validateRequestBuffer = (request: any, type: string): string => {
    if (!request) return "";

    switch (type) {
        case "encode":
            return Buffer.from(request).toString("base64").toUpperCase();
        case "decode":
            return Buffer.from(request, "base64").toString("ascii").toUpperCase().trim();

        default:
            return "";
    }
};

export const validateRequestHp = (request: any, type: string): string => {
    if (!request || request.length < 8 || request.length > 14) return "";

    const checkNumberHp = request.substring(0, 2);

    switch (type) {
        case "validation":
        case "operator":
            return request.replace(checkNumberHp, `628`);
        case "topup":
            return request.replace(checkNumberHp, `0`);
        case "integration":
        case "claimPrize":
            if (checkNumberHp === "62") return request;
            return request.replace(checkNumberHp, `628`);
        case "waGateway":
            if (checkNumberHp === "62") return checkNumberHp + "@c.us";
            return checkNumberHp.replace(checkNumberHp, "628") + "@c.us";
        default:
            return "";
    }
};

export const validateRequestMoment = (request: any, type: string): string => {
    switch (type) {
        case "date":
            return moment(request).format("YYYY-MM-DD");
        case "datetime":
            return moment(request).format("YYYY-MM-DD HH:mm:ss");
        case "datetimeConvert":
            return moment().utc(request).format("YYYY-MM-DD HH:mm:ss");
        case "datetopup":
            return moment(request).format("YYYYMMDDHHmmss");
        case "exp":
            return moment(request).format("DD/MM/YYYY");
        case "exptopup":
            return moment(request?.split("/")[1]).format("YYYY-MM-DD") ?? moment(request).format("YYYY-MM-DD");
        case "age":
            const checkAgeValid = moment(request).isValid() ? request : "";
            const calculateAge = checkAgeValid ? moment().diff(checkAgeValid, "years", false).toString() : "0";
            const age = calculateAge.length > 2 ? "0" : calculateAge;

            return age;

        default:
            return "";
    }
};

export const validateRequestEmoji = (request: any): string => {
    return request?.replace(/\p{Extended_Pictographic}/gu, (m: any, idx: any) => `[e-${m.codePointAt(0).toString(16)}]`) ?? "";
};

export const randomString = (length: number): string => {
    const char = "1234567890qwertyuiopasdfghjklzxcvbnm";
    let result = "";

    for (let index = 0; index < length; index++) {
        const random = Math.floor(Math.random() * char.length);
        result += char[random];
    }

    return result;
};

export const validateGenerateError = (message: string): never => {
    throw new Error(message);
};

export const randomHash = (value: crypto.BinaryLike, encode: crypto.BinaryToTextEncoding): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const randomStr = Math.random().toString(36).substring(7);
            const hash = crypto.createHash("sha256").update(value).digest(encode);

            const resultHash = `${hash}${randomStr}`;
            resolve(resultHash);
        } catch (error) {
            reject(error);
        }
    });
};

export const randomVoucher = (voucher: number[]): number => {
    return Math.floor(Math.random() * voucher.length + 1);
};

export const randomLuck = (value: number): number => {
    return Math.floor(Math.random() * value);
};
