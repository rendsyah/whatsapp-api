// Interfaces Whatsapp
export enum IWhatsappMediaTypes {
    image = "image/",
    video = "video/",
    application = "docs/",
}

// Interfaces Broadcast
export interface IWhatsappBroadcast {
    namespace: string;
    filename: string;
}

// Interfaces Message
export interface IWhatsappMessage {
    sender: string;
    message: string;
    link: string;
}
