// Import Modules
import { Injectable } from '@nestjs/common';
import * as Joi from 'joi';

// Import Commons
import { ApiValidationPipe } from '@commons/pipe/api-validation';
import { JoiValidationException } from '@commons/exception/api-exception';
import { ProjectDbService } from '@datasource/project-db/project-db.service';

// Import Dto
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';

// Import Interfaces
import { IProjectDbModels } from '@datasource/project-db/interfaces/project-db.interface';

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
    private readonly projectDbModels: IProjectDbModels;

    constructor(private readonly projectDbService: ProjectDbService) {
        super();
        this.projectDbModels = this.projectDbService.getModels();
    }

    public buildSchema(): Joi.Schema {
        return Joi.object<AuthRegisterDto>({
            username: Joi.string()
                .regex(new RegExp(/^\w+$/))
                .required()
                .external(async (username) => {
                    let getUser = await this.projectDbModels.UsersModel.getOneUser({ username });
                    if (getUser) {
                        throw new JoiValidationException('username', 'username already exists', 400);
                    }
                    return username;
                })
                .messages({ 'string.pattern.base': 'username must be alphanumeric' }),
            password: Joi.string().required(),
            role: Joi.string().valid('user', 'admin').required(),
        });
    }
}
