// Modules
import Joi from "joi";

// Interfaces
import {
    IRequestCreateTemplate,
    IRequestDownloadTemplate,
    IRequestGetTemplate,
    IRequestGetAllTemplate,
    IRequestUpdateTemplate,
} from "./template.dto";

// Template Schemas
export const whatsappTemplateCreateSchema = Joi.object<IRequestCreateTemplate>({
    namespace: Joi.string()
        .required()
        .pattern(new RegExp(/^[a-zA-Z0-9]+$/)),
    message: Joi.string().required(),
    channelId: Joi.string().min(16).required(),
});

export const whatsappTemplateGetSchema = Joi.object<IRequestGetTemplate>({
    id: Joi.string().min(16).required(),
});

export const whatsappTemplateGetAllSchema = Joi.object<IRequestGetAllTemplate>({
    id: Joi.string().min(16).required(),
});

export const whatsappTemplateUpdateSchema = Joi.object<IRequestUpdateTemplate>({
    id: Joi.string().min(16).required(),
    namespace: Joi.string()
        .required()
        .pattern(new RegExp(/^[a-zA-Z0-9]+$/)),
    message: Joi.string().allow(""),
});

export const whatsappTemplateDeleteSchema = Joi.object<IRequestUpdateTemplate>({
    id: Joi.string().min(16).required(),
});

export const whatsappTemplateDownloadSchema = Joi.object<IRequestDownloadTemplate>({
    extension: Joi.string().required(),
});
