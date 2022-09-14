// Modules
import { Request, Response, NextFunction } from "express";

// Interfaces
import { IWhatsappResponseService } from "../interfaces/service.interface";
import {
    IWhatsappTemplate,
    IWhatsappTemplateCreate,
    IWhatsappTemplateDelete,
    IWhatsappTemplateDownload,
    IWhatsappTemplateGet,
    IWhatsappTemplateGetAll,
    IWhatsappTemplateUpdate,
} from "../interfaces/template.interface";
import { IResponseApiSuccess } from "../../config/lib/interface";

// Common
import {
    whatsappTemplateCreateService,
    whatsappTemplateDeleteService,
    whatsappTemplateDownloadService,
    whatsappTemplateGetAllService,
    whatsappTemplateGetService,
    whatsappTemplateService,
    whatsappTemplateUpdateService,
} from "../services/template.service";
import { responseApiSuccess } from "../../config/lib/baseFunctions";

// Template Controllers
export const whatsappTemplateController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = { namespace: req.body.namespace, filename: req.file?.filename };
        const responseTemplateService: IWhatsappResponseService = await whatsappTemplateService(request as IWhatsappTemplate);
        const requestResponseData = {
            code: 200,
            status: "success",
            data: responseTemplateService,
        };

        return res.status(200).send(responseApiSuccess(requestResponseData as IResponseApiSuccess));
    } catch (error) {
        next(error);
    }
};

export const whatsappTemplateCreateController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const responseTemplateCreateService: IWhatsappResponseService = await whatsappTemplateCreateService(req.body as IWhatsappTemplateCreate);
        const requestResponseData = {
            code: 200,
            status: "success",
            data: responseTemplateCreateService,
        };
        return res.status(200).send(responseApiSuccess(requestResponseData as IResponseApiSuccess));
    } catch (error) {
        next(error);
    }
};

export const whatsappTemplateGetController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const responseTemplateGetService: IWhatsappResponseService = await whatsappTemplateGetService(req.body as IWhatsappTemplateGet);
        const requestResponseData = {
            code: 200,
            status: "success",
            data: responseTemplateGetService,
        };
        return res.status(200).send(responseApiSuccess(requestResponseData as IResponseApiSuccess));
    } catch (error) {
        next(error);
    }
};

export const whatsappTemplateGetAllController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const responseTemplateGetAllService: IWhatsappResponseService = await whatsappTemplateGetAllService(req.body as IWhatsappTemplateGetAll);
        const requestResponseData = {
            code: 200,
            status: "success",
            data: responseTemplateGetAllService,
        };
        return res.status(200).send(responseApiSuccess(requestResponseData as IResponseApiSuccess));
    } catch (error) {
        next(error);
    }
};

export const whatsappTemplateUpdateController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const responseTemplateUpdateService: IWhatsappResponseService = await whatsappTemplateUpdateService(req.body as IWhatsappTemplateUpdate);
        const requestResponseData = {
            code: 200,
            status: "success",
            data: responseTemplateUpdateService,
        };
        return res.status(200).send(responseApiSuccess(requestResponseData as IResponseApiSuccess));
    } catch (error) {
        next(error);
    }
};

export const whatsappTemplateDeleteController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const responseTemplateDeleteService: IWhatsappResponseService = await whatsappTemplateDeleteService(req.body as IWhatsappTemplateDelete);
        const requestResponseData = {
            code: 200,
            status: "success",
            data: responseTemplateDeleteService,
        };
        return res.status(200).send(responseApiSuccess(requestResponseData as IResponseApiSuccess));
    } catch (error) {
        next(error);
    }
};

export const whatsappTemplateDownloadController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const responseTemplateDownloadService: IWhatsappResponseService = await whatsappTemplateDownloadService(req.body as IWhatsappTemplateDownload);
        return res.status(200).download(responseTemplateDownloadService.data as string);
    } catch (error) {
        next(error);
    }
};
