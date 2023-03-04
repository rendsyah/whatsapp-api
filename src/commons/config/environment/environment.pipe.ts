// Import Modules
import * as Joi from 'joi';

// Define All Environment Schema
export const environmentSchema = Joi.object({
    SERVICE_NODE_ENV: Joi.string().required(),
    SERVICE_PORT: Joi.number().required(),
    SERVICE_NAME: Joi.string().required(),
    SERVICE_PREFIX: Joi.string().required(),
    SERVICE_DOCS: Joi.string().allow(''),
    SERVICE_DB_HOST: Joi.string().required(),
    SERVICE_DB_PORT: Joi.number().required(),
    SERVICE_DB_USER: Joi.string().required(),
    SERVICE_DB_PASS: Joi.string().required(),
    SERVICE_DB_NAME: Joi.string().required(),
    SERVICE_DB_ENTITIES: Joi.string().required(),
    SERVICE_DB_MIGRATIONS: Joi.string().required(),
    SERVICE_MONGO_DB_HOST: Joi.string().required(),
    SERVICE_MONGO_DB_USER: Joi.string().allow(''),
    SERVICE_MONGO_DB_PASS: Joi.string().allow(''),
    SERVICE_MONGO_DB_AUTH: Joi.string().allow(''),
    SERVICE_MONGO_DB_REPLICA: Joi.string().allow(''),
    SERVICE_REDIS_HOST: Joi.string().required(),
    SERVICE_REDIS_PORT: Joi.number().required(),
    SERVICE_JWT_SECRET_KEY: Joi.string().required(),
    SERVICE_JWT_EXPIRES_IN: Joi.string().required(),
    SERVICE_JWT_REFRESH_SECRET_KEY: Joi.string().required(),
    SERVICE_JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
    SERVICE_LIMITER_TTL: Joi.number().allow(''),
    SERVICE_LIMITER_LIMIT: Joi.number().allow(''),
    SERVICE_CRYPTO_ALGORITHM: Joi.string().allow(''),
    SERVICE_CRYPTO_SECRET_KEY: Joi.string().allow(''),
    SERVICE_UPLOAD_PATH: Joi.string().allow(''),
});
