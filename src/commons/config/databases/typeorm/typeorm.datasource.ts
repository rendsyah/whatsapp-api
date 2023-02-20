// Import Modules
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

// Define DataSource Migration
export default new DataSource({
    type: 'postgres',
    host: process.env.SERVICE_DB_HOST,
    port: +process.env.SERVICE_DB_PORT,
    username: process.env.SERVICE_DB_USER,
    password: process.env.SERVICE_DB_PASS,
    database: process.env.SERVICE_DB_NAME,
    synchronize: false,
    connectTimeoutMS: 60000,
    entities: [process.env.SERVICE_DB_ENTITIES],
    migrations: [process.env.SERVICE_DB_MIGRATIONS],
});
