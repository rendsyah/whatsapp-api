// Modules
import { Request, Response, NextFunction } from "express";

// Interfaces
import { IResponseApiSuccess } from "../config/lib/interface";

// Common
import { responseApiSuccess } from "../config/lib/baseFunctions";

// Whatsapp Controllers
export const whatsappController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestResponseData = {
            code: 200,
            status: "success",
            data: {},
        };
        return res.status(200).send(responseApiSuccess(requestResponseData as IResponseApiSuccess));
    } catch (error) {
        next(error);
    }
};
