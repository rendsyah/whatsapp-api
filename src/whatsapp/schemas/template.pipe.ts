// Modules
import Joi from "joi";

// Interfaces
import {
    IWhatsappTemplate,
    IWhatsappTemplateCreate,
    IWhatsappTemplateDownload,
    IWhatsappTemplateGet,
    IWhatsappTemplateGetAll,
    IWhatsappTemplateUpdate,
} from "../interfaces/template.interface";

// Template Schemas
export const whatsappTemplateSchema = Joi.object<IWhatsappTemplate>({
    namespace: Joi.string().required(),
});

export const whatsappTemplateCreateSchema = Joi.object<IWhatsappTemplateCreate>({
    namespace: Joi.string().required(),
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
