// Import Modules
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';

// Import Logger Service
import { apiLoggerService } from '@commons/logger';

// Import Api Exceptions
import { ApiBadRequestException } from '@commons/exception/api-exception';

export abstract class ApiValidationPipe implements PipeTransform {
    constructor() {}

    public async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
        try {
            await this.buildSchema().validateAsync(value);
            return value;
        } catch (error) {
            const getMessage = error.message.replace(/\"/g, '');
            const getParams = error.details?.[0]?.path ?? [''];

            apiLoggerService.error(`${error}`, { service: 'validation-middleware' });
            throw new ApiBadRequestException(getParams, getMessage);
        }
    }

    public abstract buildSchema(): Joi.Schema;
}
