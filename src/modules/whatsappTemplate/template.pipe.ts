// Modules
import Joi from "joi";

// Interfaces
import {
    IWhatsappTemplateCreate,
    IWhatsappTemplateDownload,
    IWhatsappTemplateGet,
    IWhatsappTemplateGetAll,
    IWhatsappTemplateUpdate,
} from "./template.dto";

// Template Schemas
export const whatsappTemplateCreateSchema = Joi.object<IWhatsappTemplateCreate>({
    namespace: Joi.string()
        .required()
        .pattern(new RegExp(/[^a-zA-Z]+$/)),
    message: Joi.string().required(),
});

export const whatsappTemplateGetSchema = Joi.object<IWhatsappTemplateGet>({
    id: Joi.string().required(),
});

export const whatsappTemplateGetAllSchema = Joi.object<IWhatsappTemplateGetAll>({
    id: Joi.string().required(),
});

export const whatsappTemplateUpdateSchema = Joi.object<IWhatsappTemplateUpdate>({
    id: Joi.string().required(),
    namespace: Joi.string().required(),
    message: Joi.string().allow(""),
});

export const whatsappTemplateDeleteSchema = Joi.object<IWhatsappTemplateUpdate>({
    id: Joi.string().required(),
});

export const whatsappTemplateDownloadSchema = Joi.object<IWhatsappTemplateDownload>({
    extension: Joi.string().required(),
});
