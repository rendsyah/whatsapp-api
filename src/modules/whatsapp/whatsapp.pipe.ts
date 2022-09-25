// Modules
import Joi from "joi";

// Interfaces
import { IRequestReplyMessageService } from "./whatsapp.dto";

// Whatsapp Schemas
export const whatsappMessageSchema = Joi.object<IRequestReplyMessageService>({
    to: Joi.string()
        .min(8)
        .pattern(new RegExp(/^[0-9]+$/))
        .required()
        .messages({
            "string.min": "data must have at least 8 characters",
            "string.pattern.base": "data must be numbers with type data string",
        }),
    type: Joi.string().required(),
    body: Joi.object({
        message: Joi.string().required().label("message"),
        link: Joi.string()
            .uri()
            .allow(null && "")
            .label("link"),
    }),
    components: Joi.array().allow(null),
});
