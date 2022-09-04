// Modules
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Interfaces
import { IResponseApiError } from "../../config/lib/baseFunctions.interface";

// Providers
import { validateRequestParams, responseApiError } from "../../config/lib/baseFunctions";

// Validation Middleware
export const whatsappValidation = (schema: Joi.ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = await schema.validateAsync(req.body);
            req.body = validated;
            next();
        } catch (error: unknown) {
            if (error instanceof Joi.ValidationError) {
                const { details } = error;
                const requestApiError = {
                    code: 400,
                    message: "parameter not valid!",
                    params: validateRequestParams(details[0].path[0], "char"),
                    detail: validateRequestParams(details[0].message, "char"),
                };
                return res.status(400).send(responseApiError(requestApiError as IResponseApiError));
            }
        }
    };
};
