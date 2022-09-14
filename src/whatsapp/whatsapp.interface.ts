// Interfaces Whatsapp Process
export interface IWhatsappConnectProcess {
    name: string;
    message: string;
    sender: string;
    media: string;
    rcvdTime: string;
    photo: string;
}

// Interfaces Whatsapp Download
export enum IWhatsappMediaTypes {
    image = "image/",
    video = "video/",
    application = "docs/",
}
