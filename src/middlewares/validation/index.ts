import { Request, Response, NextFunction } from "express";
import Joi from "joi";

import { HttpResponseStatus } from "../../config/interfaces/responseStatus.dto";
import { responseApiError } from "../../config/lib/baseFunctions";

const { Ok, Created, BadRequest, Unauthorized, Forbidden, NotFound, InternalServerError, BadGateway } = HttpResponseStatus;

export const validation = (schema: Joi.ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = await schema.validateAsync(req.body);
            req.body = validated;
            next();
        } catch (error: unknown) {
            if (error instanceof Joi.ValidationError) {
                const { details } = error;
                return res.status(BadRequest).send(responseApiError(BadRequest, "parameter not valid!", details[0].path, details[0].message));
            }
        }
    };
};
