// Modules
import { Request, Response, NextFunction } from "express";
import { ObjectSchema, ValidationError } from "joi";

// Interfaces
import { IResponseApiError } from "../../config/lib/interface";

// Commons
import { validateRequestParams, responseApiError } from "../../config/lib/baseFunctions";

// Validation Middleware
export const whatsappValidation = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = await schema.validateAsync(req.body);
            req.body = validated;
            next();
        } catch (error) {
            if (error instanceof ValidationError) {
                const { details } = error;
                const requestApiError = {
                    code: 400,
                    status: "Bad Request",
                    params: details[0].path,
                    detail: validateRequestParams(details[0].message, "char"),
                };
                return res.status(400).send(responseApiError(requestApiError as IResponseApiError));
            }
        }
    };
};
