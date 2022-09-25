// Modules
import { Request, Response, NextFunction } from "express";

// Interfaces
import { IResponseService } from "../whatsapp/whatsapp.dto";
import {
    IWhatsappTemplateCreate,
    IWhatsappTemplateDelete,
    IWhatsappTemplateDownload,
    IWhatsappTemplateGet,
    IWhatsappTemplateGetAll,
    IWhatsappTemplateUpdate,
} from "./template.dto";
import { IRequestDataSuccess } from "../../config/lib/interface";

// Commons
import {
    whatsappTemplateCreateService,
    whatsappTemplateDeleteService,
    whatsappTemplateDownloadService,
    whatsappTemplateGetAllService,
    whatsappTemplateGetService,
    whatsappTemplateUpdateService,
} from "./template.service";
import { responseApiSuccess } from "../../config/lib/baseFunctions";

// Template Controllers
export const whatsappTemplateCreateController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body: IWhatsappTemplateCreate = req.body;
        const responseService: IResponseService = await whatsappTemplateCreateService(body);
        const requestResponseData: IRequestDataSuccess = {
            code: 200,
            status: "success",
            data: responseService,
        };
        return res.status(200).send(responseApiSuccess(requestResponseData));
    } catch (error) {
        next(error);
    }
};

export const whatsappTemplateGetController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body: IWhatsappTemplateGet = req.body;
        const responseTemplateGetService: IResponseService = await whatsappTemplateGetService(body);
        const requestResponseData: IRequestDataSuccess = {
            code: 200,
            status: "success",
            data: responseTemplateGetService,
        };

        return res.status(200).send(responseApiSuccess(requestResponseData));
    } catch (error) {
        next(error);
    }
};

export const whatsappTemplateGetAllController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body: IWhatsappTemplateGetAll = req.body;
        const responseTemplateGetAllService: IResponseService = await whatsappTemplateGetAllService(body);
        const requestResponseData: IRequestDataSuccess = {
            code: 200,
            status: "success",
            data: responseTemplateGetAllService,
        };

        return res.status(200).send(responseApiSuccess(requestResponseData));
    } catch (error) {
        next(error);
    }
};

export const whatsappTemplateUpdateController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body: IWhatsappTemplateUpdate = req.body;
        const responseTemplateUpdateService: IResponseService = await whatsappTemplateUpdateService(body);
        const requestResponseData: IRequestDataSuccess = {
            code: 200,
            status: "success",
            data: responseTemplateUpdateService,
        };

        return res.status(200).send(responseApiSuccess(requestResponseData));
    } catch (error) {
        next(error);
    }
};

export const whatsappTemplateDeleteController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body: IWhatsappTemplateDelete = req.body;
        const responseTemplateDeleteService: IResponseService = await whatsappTemplateDeleteService(body);
        const requestResponseData: IRequestDataSuccess = {
            code: 200,
            status: "success",
            data: responseTemplateDeleteService,
        };

        return res.status(200).send(responseApiSuccess(requestResponseData));
    } catch (error) {
        next(error);
    }
};

export const whatsappTemplateDownloadController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body: IWhatsappTemplateDownload = req.body;
        const responseTemplateDownloadService: IResponseService = await whatsappTemplateDownloadService(body);
        const requestResponseData = responseTemplateDownloadService.data as string;

        return res.status(200).download(requestResponseData);
    } catch (error) {
        next(error);
    }
};
