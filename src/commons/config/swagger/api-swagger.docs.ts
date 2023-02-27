// Import Modules
import { applyDecorators, Type } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiRequestTimeoutResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

// Define Api Documentation Operation
export const ApiDocsOperation = (params: string) => {
    return applyDecorators(ApiOperation({ description: `Api operation for ${params}` }));
};

// Define Api Documentation Body
const ApiDocsBody = <TModel extends Type<any>>(params: string, model: TModel) => {
    return applyDecorators(ApiBody({ description: `Request body for ${params}`, type: model }));
};

// Define Api Ok Response Sample
const ApiOk = () => {
    return applyDecorators(
        ApiOkResponse({
            description: 'Successfully get data',
            schema: {
                properties: {
                    statusCode: {
                        type: 'number',
                        example: 200,
                    },
                    message: {
                        type: 'string',
                        example: 'Success',
                    },
                    data: {
                        properties: {},
                    },
                },
            },
        }),
    );
};

// Define Api Created Response Sample
const ApiCreated = () => {
    return applyDecorators(
        ApiCreatedResponse({
            description: 'Successfully created data',
            schema: {
                properties: {
                    statusCode: {
                        type: 'number',
                        example: 201,
                    },
                    message: {
                        type: 'string',
                        example: 'Success',
                    },
                    data: {
                        properties: {},
                    },
                },
            },
        }),
    );
};

// Define Api Bad Request Response Sample
const ApiBadRequest = () => {
    return applyDecorators(
        ApiBadRequestResponse({
            description: 'Bad Request',
            schema: {
                properties: {
                    statusCode: {
                        type: 'number',
                        example: 400,
                    },
                    message: {
                        type: 'string',
                        example: 'API_VALIDATION_FAILED',
                    },
                    errors: {
                        items: {
                            properties: {
                                params: {
                                    items: {
                                        type: 'string',
                                        example: 'name',
                                    },
                                },
                                detail: {
                                    type: 'string',
                                    example: 'name must be a string',
                                },
                            },
                        },
                    },
                },
            },
        }),
    );
};

// Define Api Unauthorized Response Sample
const ApiUnauthorized = () => {
    return applyDecorators(
        ApiUnauthorizedResponse({
            description: 'Unauthorized',
            schema: {
                properties: {
                    statusCode: {
                        type: 'number',
                        example: 401,
                    },
                    message: {
                        type: 'string',
                        example: 'API_UNAUTHORIZED_FAILED',
                    },
                    errors: {
                        items: {
                            properties: {
                                params: {
                                    items: {
                                        type: 'string',
                                        example: 'token',
                                    },
                                },
                                detail: {
                                    type: 'string',
                                    example: 'invalid token',
                                },
                            },
                        },
                    },
                },
            },
        }),
    );
};

// Define Api Forbidden Response Sample
const ApiForbidden = () => {
    return applyDecorators(
        ApiForbiddenResponse({
            description: 'Forbidden',
            schema: {
                properties: {
                    statusCode: {
                        type: 'number',
                        example: 403,
                    },
                    message: {
                        type: 'string',
                        example: 'API_ACCESS_FAILED',
                    },
                    errors: {
                        items: {
                            properties: {
                                params: {
                                    items: {
                                        type: 'string',
                                        example: 'role',
                                    },
                                },
                                detail: {
                                    type: 'string',
                                    example: 'access denied',
                                },
                            },
                        },
                    },
                },
            },
        }),
    );
};

// Define Api Not Found Response Sample
const ApiNotFound = () => {
    return applyDecorators(
        ApiNotFoundResponse({
            description: 'Not Found',
            schema: {
                properties: {
                    statusCode: {
                        type: 'number',
                        example: 404,
                    },
                    message: {
                        type: 'string',
                        example: 'API_DATA_FAILED',
                    },
                    errors: {
                        items: {
                            properties: {
                                params: {
                                    items: {
                                        type: 'string',
                                        example: 'id',
                                    },
                                },
                                detail: {
                                    type: 'string',
                                    example: 'id not found',
                                },
                            },
                        },
                    },
                },
            },
        }),
    );
};

// Define Api Request Timeout Response Sample
const ApiRequestTimeout = () => {
    return applyDecorators(
        ApiRequestTimeoutResponse({
            description: 'Request Timeout',
            schema: {
                properties: {
                    statusCode: {
                        type: 'number',
                        example: 408,
                    },
                    message: {
                        type: 'string',
                        example: 'API_CONNECTION_FAILED',
                    },
                    errors: {
                        items: {
                            properties: {
                                params: {
                                    items: {
                                        type: 'string',
                                        example: 'connection',
                                    },
                                },
                                detail: {
                                    type: 'string',
                                    example: 'request timeout',
                                },
                            },
                        },
                    },
                },
            },
        }),
    );
};

// Define Api Internal Server Error Response Sample
const ApiInternalServerError = () => {
    return applyDecorators(
        ApiInternalServerErrorResponse({
            description: 'Internal Server Error',
            schema: {
                properties: {
                    statusCode: {
                        type: 'number',
                        example: 500,
                    },
                    message: {
                        type: 'string',
                        example: 'API_SERVER_ERROR',
                    },
                    errors: {
                        items: {
                            properties: {
                                path: {
                                    type: 'string',
                                    example: 'api/path',
                                },
                                timestamp: {
                                    type: 'string',
                                    example: '0000-00-00T00:00:00.000Z',
                                },
                            },
                        },
                    },
                },
            },
        }),
    );
};

// Define Base Api Get Documentation
export const ApiGetServiceDocs = (params: string) => {
    return applyDecorators(
        ApiDocsOperation(params),
        ApiOk(),
        ApiBadRequest(),
        ApiUnauthorized(),
        ApiForbidden(),
        ApiNotFound(),
        ApiRequestTimeout(),
        ApiInternalServerError(),
    );
};

// Define Base Api Post Documentation
export const ApiPostServiceDocs = <TModel extends Type<any>>(params: string, model: TModel) => {
    return applyDecorators(
        ApiDocsOperation(params),
        ApiDocsBody(params, model),
        ApiCreated(),
        ApiBadRequest(),
        ApiUnauthorized(),
        ApiForbidden(),
        ApiNotFound(),
        ApiRequestTimeout(),
        ApiInternalServerError(),
    );
};
