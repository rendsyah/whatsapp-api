// Modules
import mongoose from "mongoose";
import xlsx from "xlsx";
import appRoot from "app-root-path";
import path from "path";
import fs from "fs";

// Interfaces
import {
    IWhatsappTemplate,
    IWhatsappTemplateCreate,
    IWhatsappTemplateDelete,
    IWhatsappTemplateDownload,
    IWhatsappTemplateGet,
    IWhatsappTemplateGetAll,
    IWhatsappTemplateUpdate,
} from "../interfaces/template.interface";
import { IWhatsappResponseService } from "../interfaces/service.interface";
import { ISendMessage } from "../../config/lib/interface";

// Commons
import { whatsappClient } from "../whatsapp.service";
import { BadRequestException, NotFoundException } from "../../config/lib/baseClasses";
import { validateRequestParams, validateRequestVariable, sendRequestMessage } from "../../config/lib/baseFunctions";
import models from "../../databases/models";

// Template Environments
const WHATSAPP_UPLOAD_PATH = process.env.WHATSAPP_UPLOAD_PATH as string;

// Whatsapp Template Services
export const whatsappTemplateService = async (params: IWhatsappTemplate): Promise<IWhatsappResponseService> => {
    try {
        const { namespace, filename } = params;

        const readFile = xlsx.readFile(`${appRoot}/..${WHATSAPP_UPLOAD_PATH}${filename}`);
        const dataFile: xlsx.Sheet = xlsx.utils.sheet_to_json(readFile.Sheets[readFile.SheetNames[0]], { blankrows: false });

        for (let i = 0; i < dataFile.length; i++) {
            const name = validateRequestParams(dataFile[i]?.name ?? "", "char");
            const sender = validateRequestParams(dataFile[i]?.hp ?? "", "num");
            const message = await validateRequestVariable(namespace, [name]);

            if (!name || !sender) continue;

            const requestTemplateService = {
                whatsappClient,
                sender,
                message,
            };

            setTimeout(async () => await sendRequestMessage(requestTemplateService as ISendMessage), i * 40000);
        }
        return { data: {} };
    } catch (error) {
        throw error;
    }
};

// Whatsapp Template Create Service
export const whatsappTemplateCreateService = async (params: IWhatsappTemplateCreate): Promise<IWhatsappResponseService> => {
    try {
        const { namespace, message } = params;

        const checkTemplate = await models.Templates.findOne({ namespace });

        if (checkTemplate) {
            throw new BadRequestException([namespace], "data already exist");
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
export const whatsappTemplateGetService = async (params: IWhatsappTemplateGet): Promise<IWhatsappResponseService> => {
    try {
        const { id } = params;

        const checkValidId = mongoose.isValidObjectId(id);

        if (!checkValidId) {
            throw new NotFoundException([id], "data not found");
        }

        const dataTemplate = await models.Templates.findOne({ _id: checkValidId });
        return { data: dataTemplate };
    } catch (error) {
        throw error;
    }
};

// Whatsapp Template Get All Service
export const whatsappTemplateGetAllService = async (params: IWhatsappTemplateGetAll): Promise<IWhatsappResponseService> => {
    try {
        const { id } = params;

        const checkValidId = mongoose.isValidObjectId(id);

        if (!checkValidId) {
            throw new NotFoundException([id], "data not found");
        }

        const dataTemplate = await models.Templates.find({ _id: checkValidId });
        return { data: dataTemplate };
    } catch (error) {
        throw error;
    }
};

// Whatsapp Template Update Service
export const whatsappTemplateUpdateService = async (params: IWhatsappTemplateUpdate): Promise<IWhatsappResponseService> => {
    try {
        const { id, namespace, message } = params;

        const checkValidId = mongoose.isValidObjectId(id);

        if (!checkValidId) {
            throw new NotFoundException([id], "data not found");
        }

        const dataTemplate = await models.Templates.findOne({ namespace });

        if (dataTemplate) {
            throw new BadRequestException([namespace], "data already exist");
        }

        await models.Templates.updateOne({ _id: checkValidId }, { $set: { namespace, message } });
        return { data: {} };
    } catch (error) {
        throw error;
    }
};

// Whatsapp Template Delete Service
export const whatsappTemplateDeleteService = async (params: IWhatsappTemplateDelete): Promise<IWhatsappResponseService> => {
    try {
        const { id } = params;

        const checkValidId = mongoose.isValidObjectId(id);

        if (!checkValidId) {
            throw new NotFoundException([id], "data not found");
        }

        await models.Templates.deleteOne({ _id: checkValidId });
        return { data: {} };
    } catch (error) {
        throw error;
    }
};

// Whatsapp Template Download Service
export const whatsappTemplateDownloadService = async (params: IWhatsappTemplateDownload): Promise<IWhatsappResponseService> => {
    const { extension } = params;

    const dataTemplatePath = path.resolve(`${appRoot}/../public/template/Template_v1.${extension}`);

    if (!fs.existsSync(dataTemplatePath)) {
        throw new NotFoundException([extension], "data not found");
    }

    return { data: dataTemplatePath };
};
