// Modules
import Joi from "joi";

// Interfaces
import { IWhatsappBroadcast, IWhatsappMessage } from "./whatsapp.interface";

// Broadcast Schemas
export const whatsappBroadcastSchema = Joi.object<IWhatsappBroadcast>({
    namespace: Joi.string().required(),
});

// Message Schemas
export const whatsappMessageSchema = Joi.object<IWhatsappMessage>({
    message: Joi.string().required(),
    sender: Joi.string()
        .pattern(new RegExp(/^[0-9]+$/))
        .required(),
    link: Joi.string().uri().allow(""),
});
