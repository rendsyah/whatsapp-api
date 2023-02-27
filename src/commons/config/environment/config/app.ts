// Import Modules
import { registerAs } from '@nestjs/config';

// Define Prefix Config App
export default registerAs('app', () => ({
    SERVICE_NODE_ENV: process.env.NODE_ENV,
    SERVICE_PORT: process.env.SERVICE_PORT,
    SERVICE_NAME: process.env.SERVICE_NAME,
    SERVICE_PREFIX: process.env.SERVICE_PREFIX,
    SERVICE_DOCS: process.env.SERVICE_DOCS,
    SERVICE_JWT_SECRET_KEY: process.env.SERVICE_JWT_SECRET_KEY,
    SERVICE_JWT_EXPIRES_IN: process.env.SERVICE_JWT_EXPIRES_IN,
    SERVICE_JWT_REFRESH_SECRET_KEY: process.env.SERVICE_JWT_REFRESH_SECRET_KEY,
    SERVICE_JWT_REFRESH_EXPIRES_IN: process.env.SERVICE_JWT_REFRESH_EXPIRES_IN,
    SERVICE_CRYPTO_ALGORITHM: process.env.SERVICE_CRYPTO_ALGORITHM,
    SERVICE_CRYPTO_SECRET_KEY: process.env.SERVICE_CRYPTO_SECRET_KEY,
    SERVICE_UPLOAD_PATH: process.env.SERVICE_UPLOAD_PATH,
}));
