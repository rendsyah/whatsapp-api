// Interfaces
import { IWhatsappMessage } from "../interfaces/message.interface";
import { IWhatsappResponseService } from "../interfaces/service.interface";
import { ISendMessage } from "../../config/lib/interface";

// Providers
import { whatsappClient } from "../whatsapp.service";
import { sendRequestMessage } from "../../config/lib/baseFunctions";

// Whatsapp Message Services
export const whatsappMessageService = async (params: IWhatsappMessage): Promise<IWhatsappResponseService> => {
    try {
        const { sender, message, link } = params;

        const requestSendMessage = {
            whatsappClient,
            sender,
            message,
            link,
        };

        const responseData = await sendRequestMessage(requestSendMessage as ISendMessage);
        return { data: responseData };
    } catch (error) {
        throw error;
    }
};
