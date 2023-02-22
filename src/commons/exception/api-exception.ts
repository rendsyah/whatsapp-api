// Import Modules
import { HttpException, HttpStatus } from '@nestjs/common';

// Define Base Bad Request Exception
export class ApiBadRequestException extends HttpException {
    constructor(params: string[], detail: string) {
        super(
            {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'API_VALIDATION_FAILED',
                errors: [
                    {
                        params: params,
                        detail: detail,
                    },
                ],
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}

// Define Base Unauthorized Exception
export class ApiUnauthorizedException extends HttpException {
    constructor(detail: string) {
        super(
            {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'API_UNAUTHORIZED_FAILED',
                errors: [
                    {
                        params: ['token'],
                        detail: detail,
                    },
                ],
            },
            HttpStatus.UNAUTHORIZED,
        );
    }
}

// Define Base Forbidden Exception
export class ApiForbiddenException extends HttpException {
    constructor(detail: string) {
        super(
            {
                statusCode: HttpStatus.FORBIDDEN,
                message: 'API_ACCESS_FAILED',
                errors: [
                    {
                        params: ['role'],
                        detail: detail,
                    },
                ],
            },
            HttpStatus.FORBIDDEN,
        );
    }
}

// Define Base Not Found Exception
export class ApiNotFoundException extends HttpException {
    constructor(params: string[], detail: string) {
        super(
            {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'API_DATA_FAILED',
                errors: [
                    {
                        params: params,
                        detail: detail,
                    },
                ],
            },
            HttpStatus.NOT_FOUND,
        );
    }
}

// Define Base Request Timeout Exception
export class ApiRequestTimeoutException extends HttpException {
    constructor(detail: string) {
        super(
            {
                statusCode: HttpStatus.REQUEST_TIMEOUT,
                message: 'API_CONNECTION_FAILED',
                errors: [
                    {
                        params: ['connection'],
                        detail: detail,
                    },
                ],
            },
            HttpStatus.REQUEST_TIMEOUT,
        );
    }
}

// Define Base Internal Server Error Exception
export class ApiInternalServerErrorException extends HttpException {
    constructor(path: string) {
        super(
            {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'API_SERVER_ERROR',
                errors: [
                    {
                        path: path,
                        timestamp: new Date().toISOString(),
                    },
                ],
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
