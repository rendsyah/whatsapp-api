// Import Modules
import { config } from 'dotenv';

config();

// Define Service Constants Variables
const SERVICE_ENV_DEVELOPMENT = process.env.NODE_ENV === 'development';
const SERVICE_NAME = process.env.SERVICE_NAME;
const SERVICE_UPLOAD_FILE_SIZE = 10 * 1000 * 1000;

// Export All Constants
export { SERVICE_ENV_DEVELOPMENT, SERVICE_NAME, SERVICE_UPLOAD_FILE_SIZE };
