// Modules
import { Request, Response, NextFunction } from "express";
import { ObjectSchema, ValidationError } from "joi";

// Interfaces
import { IRequestDataError } from "../config/lib/interface";

// Commons
import { validateRequestParams, responseApiError } from "../config/lib/baseFunctions";

// Validation Middleware
export const whatsappValidation = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = await schema.validateAsync(req.body, { abortEarly: false });
            req.body = validated;
            next();
        } catch (error) {
            if (error instanceof ValidationError) {
                const { details } = error;
                const requestResponseData: IRequestDataError = {
                    code: 400,
                    status: "Bad Request",
                    params: details[0]?.context?.key ?? (details[0]?.path[0] as string) ?? "",
                    detail: validateRequestParams(details[0].message, "char"),
                };

                return res.status(400).send(responseApiError(requestResponseData));
            }
        }
    };
};
