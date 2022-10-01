// Interfaces Reply Message
interface IRequestBody {
    message: string;
    link?: string;
}

type IRequestType = "text/individual" | "text-image/individual";

export interface IRequestReplyMessageService {
    to: string;
    type: IRequestType;
    body: IRequestBody;
}

// Interfaces Media Type
export enum IRequestMediaType {
    image = "image/",
    video = "video/",
    application = "docs/",
}

// Interfaces Response Service
export interface IResponseWhatsappService {
    data: unknown;
}
