// Interfaces Message Service
interface IRequestBody {
    message: string;
    image?: string;
}

export interface IRequestMessageService {
    to: string;
    type: string;
    body: IRequestBody;
}

// Interfaces Reply Service
export interface IRequestReplyService {
    to: string;
    message: string;
    media: string;
    type: string;
    image?: string;
}

// Interfaces Media
export enum IRequestMediaType {
    image = "image/",
    video = "video/",
    application = "docs/",
}

// Interfaces Response Service
export interface IResponseWhatsappService {
    data: unknown;
}
