// Modules
import Joi from "joi";

// Interfaces
import {
    IRequestCreateTemplate,
    IRequestDownloadTemplate,
    IRequestGetTemplate,
    IRequestGetAllTemplate,
    IRequestUpdateTemplate,
} from "./whatsappTemplate.dto";

// Template Schemas
export const whatsappCreateTemplateSchema = Joi.object<IRequestCreateTemplate>({
    namespace: Joi.string()
        .required()
        .pattern(new RegExp(/^[a-zA-Z0-9]+$/)),
    message: Joi.string().required(),
    channelId: Joi.string().min(16).required(),
});

export const whatsappGetTemplateSchema = Joi.object<IRequestGetTemplate>({
    id: Joi.string().min(16).required(),
});

export const whatsappGetAllTemplateSchema = Joi.object<IRequestGetAllTemplate>({
    id: Joi.string().min(16).required(),
});

export const whatsappUpdateTemplateSchema = Joi.object<IRequestUpdateTemplate>({
    id: Joi.string().min(16).required(),
    namespace: Joi.string()
        .required()
        .pattern(new RegExp(/^[a-zA-Z0-9]+$/)),
    message: Joi.string().allow(null && ""),
});

export const whatsappDeleteTemplateSchema = Joi.object<IRequestUpdateTemplate>({
    id: Joi.string().min(16).required(),
});

export const whatsappDownloadTemplateSchema = Joi.object<IRequestDownloadTemplate>({
    extension: Joi.string().required().valid("csv", "xlsx").messages({ "any.only": "extension is not exists" }),
});
