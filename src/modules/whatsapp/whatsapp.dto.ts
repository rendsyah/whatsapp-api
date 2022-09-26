// Interfaces Whatsapp
interface IRequestBody {
    message: string;
    link?: string;
}

interface IRequestParameter {
    type: string;
    text: string;
    link: string;
}

interface IRequestComponent {
    type: string;
    parameters: IRequestParameter[];
}

export interface IRequestReplyMessageService {
    to: string;
    type: string;
    body: IRequestBody;
    components?: IRequestComponent[];
}

export enum IRequestMediaType {
    image = "image/",
    video = "video/",
    application = "docs/",
}

export interface IResponseWhatsappService {
    data: unknown;
}
