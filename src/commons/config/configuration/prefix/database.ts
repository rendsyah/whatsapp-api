// Import Modules
import { registerAs } from '@nestjs/config';

// Define Prefix Config DB
export default registerAs('db', () => ({
    SERVICE_DB_HOST: process.env.SERVICE_DB_HOST,
    SERVICE_DB_PORT: process.env.SERVICE_DB_PORT,
    SERVICE_DB_USER: process.env.SERVICE_DB_USER,
    SERVICE_DB_PASS: process.env.SERVICE_DB_PASS,
    SERVICE_DB_NAME: process.env.SERVICE_DB_NAME,
    SERVICE_DB_ENTITIES: process.env.SERVICE_DB_ENTITIES,
    SERVICE_DB_MIGRATIONS: process.env.SERVICE_DB_MIGRATIONS,
    SERVICE_MONGO_DB_HOST: process.env.SERVICE_MONGO_DB_HOST,
    SERVICE_MONGO_DB_USER: process.env.SERVICE_MONGO_DB_USER,
    SERVICE_MONGO_DB_PASS: process.env.SERVICE_MONGO_DB_PASS,
    SERVICE_MONGO_DB_AUTH: process.env.SERVICE_MONGO_DB_AUTH,
    SERVICE_MONGO_DB_REPLICA: process.env.SERVICE_MONGO_DB_REPLICA,
    SERVICE_REDIS_HOST: process.env.SERVICE_REDIS_HOST,
    SERVICE_REDIS_PORT: process.env.SERVICE_REDIS_PORT,
}));
