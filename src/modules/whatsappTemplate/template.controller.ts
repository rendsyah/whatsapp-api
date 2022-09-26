// Modules
import { Request, Response, NextFunction } from "express";

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
import { IRequestDataSuccess } from "../../config/lib/interface";

// Commons
import {
    whatsappCreateTemplateService,
    whatsappDeleteTemplateService,
    whatsappDownloadTemplateService,
    whatsappGetAllTemplateService,
    whatsappGetTemplateService,
    whatsappUpdateTemplateService,
} from "./template.service";
import { responseApiSuccess } from "../../config/lib/baseFunctions";

// Template Controllers
export const whatsappCreateTemplateController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const params: IRequestCreateTemplate = req.body;
        const responseService: IResponseTemplateService = await whatsappCreateTemplateService(params);
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

export const whatsappGetTemplateController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const params: IRequestGetTemplate = req.body;
        const responseService: IResponseTemplateService = await whatsappGetTemplateService(params);
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

export const whatsappGetAllTemplateController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const params: IRequestGetAllTemplate = req.body;
        const responseService: IResponseTemplateService = await whatsappGetAllTemplateService(params);
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

export const whatsappTemplateUpdateController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const params: IRequestUpdateTemplate = req.body;
        const responseService: IResponseTemplateService = await whatsappUpdateTemplateService(params);
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

export const whatsappDeleteTemplateController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const params: IRequestDeleteTemplate = req.body;
        const responseService: IResponseTemplateService = await whatsappDeleteTemplateService(params);
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

export const whatsappDownloadTemplateController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const params: IRequestDownloadTemplate = req.body;
        const responseService: IResponseTemplateService = await whatsappDownloadTemplateService(params);
        const requestResponseData = responseService.data as string;

        return res.status(200).download(requestResponseData);
    } catch (error) {
        next(error);
    }
};
