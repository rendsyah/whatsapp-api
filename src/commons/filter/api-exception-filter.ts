// Import Modules
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

// Import Service
import { apiLoggerService } from '../logger';

@Catch()
export class ApiExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
        const ctxApi = httpAdapter.getRequestUrl(ctx.getRequest());
        const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        if (httpStatus >= 500) {
            apiLoggerService.error(`${exception}`, [ctxApi]);
        }

        const responseServiceError = {
            statusCode: httpStatus,
            message: 'API_SERVER_ERROR',
            errors: [
                {
                    path: ctxApi,
                    timestamp: new Date().toISOString(),
                },
            ],
        };

        const responseBody = exception instanceof HttpException ? exception.getResponse() : responseServiceError;

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
