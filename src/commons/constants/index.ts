// Import Modules
import { config } from 'dotenv';
config();

// Define Service Constants Variables
const SERVICE_ENV_DEVELOPMENT = process.env.NODE_ENV === 'development';
const SERVICE_NAME = process.env.SERVICE_NAME;
const SERVICE_BASE_URL = process.env.SERVICE_BASE_URL;
const SERVICE_UPLOAD_FILE_SIZE = 10 * 1000 * 1000; // 10MB
const SERVICE_UPlOAD_USER = `${SERVICE_BASE_URL}/api/image/users/`;
const SERVICE_UPLOAD_TRANSACTION = `${SERVICE_BASE_URL}/api/image/transactions`;

// Export All Constants
export {
    SERVICE_ENV_DEVELOPMENT,
    SERVICE_NAME,
    SERVICE_BASE_URL,
    SERVICE_UPLOAD_FILE_SIZE,
    SERVICE_UPlOAD_USER,
    SERVICE_UPLOAD_TRANSACTION,
};
