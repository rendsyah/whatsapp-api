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
            "string.min": "to must have at least 8 characters",
            "string.pattern.base": "to must be numbers with type data string",
        }),
    type: Joi.string().valid("text/individual", "text-image/individual", "template/individual").required().messages({ "any.only": "type is not exists" }),
    body: Joi.object({
        message: Joi.string().required().label("message"),
        link: Joi.string()
            .when(Joi.ref("...type"), {
                is: Joi.string().valid("text-image/individual"),
                then: Joi.string()
                    .uri({ scheme: ["http", "https"] })
                    .required()
                    .label("link")
                    .messages({ "string.uriCustomScheme": "link must be a valid uri" }),
                otherwise: Joi.forbidden(),
            })
            .label("link"),
    }).required(),
});
