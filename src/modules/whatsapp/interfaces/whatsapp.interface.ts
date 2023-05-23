// Import Modules
import { MessageId } from 'whatsapp-web.js';

// Define Whatsapp Receive Message Consumer Interface
export interface IWhatsappReceiveMessageConsumer {
    sender: string;
    name: string;
    message: string;
    photo: string;
    rcvdTime: string;
}

// Define Whatsapp Receive Message Response Interface
export interface IWhatsappReceiveMessageResponse {
    sender: string;
    message: string;
}

// Define Whatsapp Send Message Consumer Interface
export interface IWhatsappSendMessageConsumer extends IWhatsappReceiveMessageResponse {
    from: string;
}

// Define Whatsapp Send Message Response Interface
export interface IWhatsappSendMessageResponse extends MessageId {}
