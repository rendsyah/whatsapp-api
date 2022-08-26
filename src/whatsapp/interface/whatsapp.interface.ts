export enum IWhatsappMediaTypes {
    image = "image/",
    video = "video/",
    application = "docs/",
}

export interface IWhatsappBroadcast {
    filename: string;
}

export interface IWhatsappMessage {
    sender: string;
    message: string;
    link: string;
}
