// Interfaces BaseFunctions
export type ITypeParams = "char" | "charSpace" | "num" | "numChar" | "numCharSpace" | "any";

export type ITypeBuffer = "encode" | "decode";

export type ItypeMoment = "date" | "datetime" | "datetime2";

export type ItypeChar = "alpha" | "numeric" | "alphanumeric";

export interface ISendMessage {
    whatsappClient: unknown;
    sender: string;
    message: string;
    link?: string;
}

export interface IResponseApiError {
    code: number;
    status: string;
    params: string[] | number[];
    detail: string;
}

export interface IResponseApiSuccess {
    code: number;
    status: string;
    data: any;
}
