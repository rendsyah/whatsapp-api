// Modules
import mongoose from "mongoose";
import appRoot from "app-root-path";
import path from "path";
import fs from "fs";

// Interfaces
import {
    IWhatsappTemplateCreate,
    IWhatsappTemplateDelete,
    IWhatsappTemplateDownload,
    IWhatsappTemplateGet,
    IWhatsappTemplateGetAll,
    IWhatsappTemplateUpdate,
} from "./template.dto";
import { IResponseService } from "../whatsapp/whatsapp.dto";

// Commons
import { BadRequestException, NotFoundException } from "../../config/lib/baseClasses";
import models from "../../databases/models";

// Whatsapp Template Create Service
export const whatsappTemplateCreateService = async (params: IWhatsappTemplateCreate): Promise<IResponseService> => {
    try {
        const { namespace, message } = params;

        const dataTemplate = await models.Templates.findOne({ namespace });

        if (dataTemplate) {
            throw new BadRequestException("namespace", "data already exist");
        }

        await models.Templates.create({
            namespace,
            message,
            channel: { _id: "63182cf0768290a9bc0fbf7c" },
        });

        return { data: {} };
    } catch (error) {
        throw error;
    }
};

// Whatsapp Template Get Service
export const whatsappTemplateGetService = async (params: IWhatsappTemplateGet): Promise<IResponseService> => {
    try {
        const { id } = params;

        const checkValidId = mongoose.isValidObjectId(id);

        if (!checkValidId) {
            throw new NotFoundException("id", "data not found");
        }

        const dataTemplate = await models.Templates.findOne({ _id: checkValidId });

        return { data: dataTemplate };
    } catch (error) {
        throw error;
    }
};

// Whatsapp Template Get All Service
export const whatsappTemplateGetAllService = async (params: IWhatsappTemplateGetAll): Promise<IResponseService> => {
    try {
        const { id } = params;

        const checkValidId = mongoose.isValidObjectId(id);

        if (!checkValidId) {
            throw new NotFoundException("id", "data not found");
        }

        const dataTemplate = await models.Templates.find({ _id: checkValidId });

        return { data: dataTemplate };
    } catch (error) {
        throw error;
    }
};

// Whatsapp Template Update Service
export const whatsappTemplateUpdateService = async (params: IWhatsappTemplateUpdate): Promise<IResponseService> => {
    try {
        const { id, namespace, message } = params;

        const checkValidId = mongoose.isValidObjectId(id);

        if (!checkValidId) {
            throw new NotFoundException("id", "data not found");
        }

        const dataTemplate = await models.Templates.findOne({ namespace });

        if (dataTemplate) {
            throw new BadRequestException("namespace", "data already exist");
        }

        await models.Templates.updateOne({ _id: checkValidId }, { $set: { namespace, message } });

        return { data: {} };
    } catch (error) {
        throw error;
    }
};

// Whatsapp Template Delete Service
export const whatsappTemplateDeleteService = async (params: IWhatsappTemplateDelete): Promise<IResponseService> => {
    try {
        const { id } = params;

        const checkValidId = mongoose.isValidObjectId(id);

        if (!checkValidId) {
            throw new NotFoundException("id", "data not found");
        }

        await models.Templates.deleteOne({ _id: checkValidId });

        return { data: {} };
    } catch (error) {
        throw error;
    }
};

// Whatsapp Template Download Service
export const whatsappTemplateDownloadService = async (params: IWhatsappTemplateDownload): Promise<IResponseService> => {
    const { extension } = params;

    const templatePath = path.resolve(`${appRoot}/../public/template/Template_v1.${extension}`);

    if (!fs.existsSync(templatePath)) {
        throw new NotFoundException("extension", "data not found");
    }

    return { data: templatePath };
};
