// Import Modules
import { registerAs } from '@nestjs/config';

// Define Prefix Config App
export default registerAs('app', () => ({
    SERVICE_PORT: process.env.SERVICE_PORT,
    SERVICE_NAME: process.env.SERVICE_NAME,
    SERVICE_PREFIX: process.env.SERVICE_PREFIX,
    SERVICE_DOCS: process.env.SERVICE_DOCS,
    SERVICE_JWT_SECRET_KEY: process.env.SERVICE_JWT_SECRET_KEY,
    SERVICE_JWT_EXPIRES_IN: process.env.SERVICE_JWT_EXPIRES_IN,
    SERVICE_JWT_REFRESH_SECRET_KEY: process.env.SERVICE_JWT_REFRESH_SECRET_KEY,
    SERVICE_JWT_REFRESH_EXPIRES_IN: process.env.SERVICE_JWT_REFRESH_EXPIRES_IN,
}));
