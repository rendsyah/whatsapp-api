import Joi from "joi";

// Interface
import { IWhatsappMessage } from "./interface/whatsapp.interface";

// Schema
export const whatsappMessageSchema = Joi.object<IWhatsappMessage>({
    message: Joi.string().required(),
    sender: Joi.string()
        .pattern(new RegExp(/^[0-9]+$/))
        .required(),
    link: Joi.string().uri().allow(""),
});
