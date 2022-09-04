// Interfaces
import { IWhatsappMessage } from "../whatsapp.interface";
import { ISendMessage } from "../../config/lib/baseFunctions.interface";

// Providers
import { whatsappClient } from "../whatsapp.service";
import { sendRequestMessage } from "../../config/lib/baseFunctions";

// Whatsapp Message Services
export const whatsappMessageService = async (params: IWhatsappMessage): Promise<unknown> => {
    try {
        const { sender, message, link } = params;

        const requestSendMessage = {
            whatsappClient,
            sender,
            message,
            link,
        };

        const responseData = await sendRequestMessage(requestSendMessage as ISendMessage);
        return responseData?.id;
    } catch (error) {
        throw error;
    }
};
