// Import Modules
import { Injectable } from '@nestjs/common';
import * as Joi from 'joi';

// Import Commons
import { ApiValidationPipe } from '@commons/pipe/api-validation';

// Import Dto
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthLoginSchema extends ApiValidationPipe {
    constructor() {
        super();
    }

    public buildSchema(): Joi.Schema {
        return Joi.object<AuthLoginDto>({
            username: Joi.string().required(),
            password: Joi.string().required(),
        });
    }
}

@Injectable()
export class AuthRegisterSchema extends ApiValidationPipe {
    constructor() {
        super();
    }

    public buildSchema(): Joi.Schema {
        return Joi.object<AuthRegisterDto>({
            username: Joi.string()
                .regex(new RegExp(/^\w+$/))
                .required()
                .messages({ 'string.pattern.base': 'username must be alphanumeric' }),
            password: Joi.string().required(),
            role: Joi.string().valid('user', 'admin').required(),
        });
    }
}
