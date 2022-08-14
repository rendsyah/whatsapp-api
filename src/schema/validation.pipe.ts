import Joi from "joi";

// Data Transfer Object
import { IRequestCallback } from "../config/interfaces/validation.dto";

// Schema
export const callbackSchema = Joi.object<IRequestCallback>({
    message: Joi.string().required(),
    sender: Joi.string()
        .pattern(new RegExp(/^[0-9]+$/))
        .required(),
});
