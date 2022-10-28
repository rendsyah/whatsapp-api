// Modules
import { Request, Response, NextFunction } from "express";

// Interfaces
import { IRequestMessageService, IResponseWhatsappService } from "./whatsapp.interface";
import { IRequestDataSuccess } from "../../config/lib/base.dto";

// Services
import { whatsappMessageService } from "./whatsapp.service";

// Commons
import { responseApiSuccess } from "../../config/lib/baseFunctions";

// Whatsapp Controllers
export const whatsappController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestResponseData: IRequestDataSuccess = {
            code: 200,
            status: "success",
            data: {},
        };

        return res.status(200).send(responseApiSuccess(requestResponseData));
    } catch (error) {
        next(error);
    }
};

export const whatsappMessageController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const params: IRequestMessageService = req.body;
        const responseService: IResponseWhatsappService = await whatsappMessageService(params);
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
