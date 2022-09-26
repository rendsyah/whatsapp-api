// Interfaces BaseFunctions
export type ITypeParams = "char" | "charSpace" | "num" | "numChar" | "numCharSpace" | "any";

export type ITypeBuffer = "encode" | "decode";

export type ItypeMoment = "date" | "datetime" | "datetime2";

export type ItypeChar = "alpha" | "numeric" | "alphanumeric";

export interface IRequestDataError {
    code: number;
    status: string;
    params: string;
    detail: string;
}

export interface IRequestDataSuccess {
    code: number;
    status: string;
    data: any;
}
