// Modules
import Joi from "joi";

// Interfaces
import { IWhatsappMessage } from "../interfaces/message.interface";

// Message Schemas
export const whatsappMessageSchema = Joi.object<IWhatsappMessage>({
    message: Joi.string().required(),
    sender: Joi.string()
        .pattern(new RegExp(/^[0-9]+$/))
        .required(),
    link: Joi.string().uri().allow(""),
});
