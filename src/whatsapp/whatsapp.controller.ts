import { Request, Response, NextFunction } from "express";

import { IWhatsappBroadcast, IWhatsappMessage } from "./interface/whatsapp.interface";
import { responseApiSuccess } from "../config/lib/baseFunctions";
import { whatsappBroadcastService, whatsappMessageService } from "./whatsapp.service";

export const whatsappBroadcastController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const responseBroadcastService = await whatsappBroadcastService(req.file as IWhatsappBroadcast);
        return res.status(200).send(responseApiSuccess(200, "success", responseBroadcastService));
    } catch (error) {
        next(error);
    }
};

export const whatsappMessageController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const responseMessageService = await whatsappMessageService(req.body as IWhatsappMessage);
        return res.status(200).send(responseApiSuccess(200, "success", responseMessageService));
    } catch (error) {
        next(error);
    }
};
