// Import Modules
import { Message, MessageId } from 'whatsapp-web.js';

// Define Whatsapp Receive Message Interface
export interface IWhatsappReceiveMessage {
    sender: string;
    name: string;
    message: string;
    photo: string;
    media: 300;
    rcvdTime: string;
}

// Define Whatsapp Receive Message Consumer Interface
export interface IWhatsappReceiveMessageConsumer {
    message: Message;
}

// Define Whatsapp Receive Message Response Interface
export interface IWhatsappReceiveMessageResponse {
    sender: string;
    message: string;
}

// Define Whatsapp Send Message Consumer Interface
export interface IWhatsappSendMessageConsumer extends IWhatsappReceiveMessageResponse {
    from: string;
    sentTime: string;
}

// Define Whatsapp Send Message Response Interface
export interface IWhatsappSendMessageResponse extends MessageId {}
