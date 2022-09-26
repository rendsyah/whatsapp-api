// Modules
import mongoose from "mongoose";
import appRoot from "app-root-path";
import path from "path";
import fs from "fs";

// Interfaces
import {
    IRequestCreateTemplate,
    IRequestDeleteTemplate,
    IRequestDownloadTemplate,
    IRequestGetTemplate,
    IRequestGetAllTemplate,
    IRequestUpdateTemplate,
    IResponseTemplateService,
} from "./template.dto";

// Commons
import { BadRequestException, NotFoundException } from "../../config/lib/baseClasses";
import models from "../../databases/models";

// Whatsapp Template Create Service
export const whatsappCreateTemplateService = async (params: IRequestCreateTemplate): Promise<IResponseTemplateService> => {
    try {
        const { namespace, message, channelId } = params;

        const getTemplate = await models.Templates.findOne({ namespace: namespace });

        if (getTemplate) {
            throw new BadRequestException("namespace", "data already exist");
        }

        await models.Templates.create({
            namespace,
            message,
            channelId,
        });

        return { data: {} };
    } catch (error) {
        throw error;
    }
};

// Whatsapp Template Get Service
export const whatsappGetTemplateService = async (params: IRequestGetTemplate): Promise<IResponseTemplateService> => {
    try {
        const { id } = params;

        const checkingId = mongoose.isValidObjectId(id);

        if (!checkingId) {
            throw new BadRequestException("id", "data invalid");
        }

        const getTemplate = await models.Templates.findOne({ _id: id }, "namespace message channelId");

        if (!getTemplate) {
            throw new NotFoundException("id", "data not found");
        }

        return { data: getTemplate };
    } catch (error) {
        throw error;
    }
};

// Whatsapp Template Get All Service
export const whatsappGetAllTemplateService = async (params: IRequestGetAllTemplate): Promise<IResponseTemplateService> => {
    try {
        const { id } = params;

        const checkingId = mongoose.isValidObjectId(id);

        if (!checkingId) {
            throw new BadRequestException("id", "data invalid");
        }

        const getTemplate = await models.Templates.find({ _id: id }, "namespace message channelId");

        if (!getTemplate) {
            throw new NotFoundException("id", "data not found");
        }

        return { data: getTemplate };
    } catch (error) {
        throw error;
    }
};

// Whatsapp Template Update Service
export const whatsappUpdateTemplateService = async (params: IRequestUpdateTemplate): Promise<IResponseTemplateService> => {
    try {
        const { id, namespace, message } = params;

        const checkingId = mongoose.isValidObjectId(id);

        if (!checkingId) {
            throw new BadRequestException("id", "data invalid");
        }

        const getTemplate = await models.Templates.findOne({ namespace });

        if (getTemplate) {
            throw new BadRequestException("namespace", "data already exist");
        }

        await models.Templates.updateOne({ _id: id }, { $set: { namespace, message } });

        return { data: {} };
    } catch (error) {
        throw error;
    }
};

// Whatsapp Template Delete Service
export const whatsappDeleteTemplateService = async (params: IRequestDeleteTemplate): Promise<IResponseTemplateService> => {
    try {
        const { id } = params;

        const checkingId = mongoose.isValidObjectId(id);

        if (!checkingId) {
            throw new BadRequestException("id", "data invalid");
        }

        const deleteTemplate = await models.Templates.findByIdAndDelete({ _id: id });

        if (!deleteTemplate) {
            throw new NotFoundException("id", "data not found");
        }

        return { data: {} };
    } catch (error) {
        throw error;
    }
};

// Whatsapp Template Download Service
export const whatsappDownloadTemplateService = async (params: IRequestDownloadTemplate): Promise<IResponseTemplateService> => {
    const { extension } = params;

    const templatePath = path.resolve(`${appRoot}/../public/template/Template_v1.${extension}`);

    if (!fs.existsSync(templatePath)) {
        throw new NotFoundException("extension", "data not found");
    }

    return { data: templatePath };
};
