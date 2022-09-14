// Modules
import { Request, Response, NextFunction } from "express";

// Interfaces
import { IWhatsappResponseService } from "../interfaces/service.interface";
import { IWhatsappMessage } from "../interfaces/message.interface";
import { IResponseApiSuccess } from "../../config/lib/interface";

// Common
import { whatsappMessageService } from "../services/message.service";
import { responseApiSuccess } from "../../config/lib/baseFunctions";

// Message Controllers
export const whatsappMessageController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const responseMessageService: IWhatsappResponseService = await whatsappMessageService(req.body as IWhatsappMessage);
        const requestResponseData = {
            code: 200,
            status: "success",
            data: responseMessageService,
        };
        return res.status(200).send(responseApiSuccess(requestResponseData as IResponseApiSuccess));
    } catch (error) {
        next(error);
    }
};
