// Modules
import { Request, Response, NextFunction } from "express";

// Interfaces
import { IWhatsappBroadcast, IWhatsappMessage } from "./whatsapp.interface";
import { IResponseApiSuccess } from "../config/lib/baseFunctions.interface";

// Providers
import { whatsappBroadcastService } from "./broadcast/broadcast.service";
import { whatsappMessageService } from "./message/message.service";
import { responseApiSuccess } from "../config/lib/baseFunctions";

// Broadcast Controllers
export const whatsappBroadcastController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = { namespace: req.body.namespace, filename: req.file?.filename };
        const responseBroadcastService = await whatsappBroadcastService(request as IWhatsappBroadcast);
        const requestResponseData = {
            code: 200,
            status: "success",
            data: responseBroadcastService,
        };
        return res.status(200).send(responseApiSuccess(requestResponseData as IResponseApiSuccess));
    } catch (error) {
        next(error);
    }
};

// Message Controllers
export const whatsappMessageController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const responseMessageService = await whatsappMessageService(req.body as IWhatsappMessage);
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
