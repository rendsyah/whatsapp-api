import { Request, Response, NextFunction } from "express";
import Joi from "joi";

import { responseApiError } from "../../config/lib/baseFunctions";

export const whatsappValidation = (schema: Joi.ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = await schema.validateAsync(req.body);
            req.body = validated;
            next();
        } catch (error: unknown) {
            if (error instanceof Joi.ValidationError) {
                const { details } = error;
                return res.status(400).send(responseApiError(400, "parameter not valid!", details[0].path, details[0].message));
            }
        }
    };
};
