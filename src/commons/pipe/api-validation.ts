// Import Modules
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';

// Import Exceptions
import { ApiBadRequestException, ApiNotFoundException } from '../exception/api-exception';

export abstract class ApiValidationPipe implements PipeTransform {
    constructor() {}

    public async transform(value: unknown, metadata: ArgumentMetadata) {
        try {
            await this.buildSchema().validateAsync(value, { abortEarly: false });
            return value;
        } catch (error) {
            const message = error.message.replace(/\"/g, '');
            const params = error.details?.[0]?.path;

            if (!error.statusCode) {
                throw new ApiBadRequestException(params, message);
            }
            if (error.statusCode === 400) {
                throw new ApiBadRequestException(params, message);
            }
            if (error.statusCode === 404) {
                throw new ApiNotFoundException(params, message);
            }
        }
    }

    public abstract buildSchema(): Joi.Schema;
}
