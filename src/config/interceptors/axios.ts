// Modules
import axios from "axios";

// Logger
import { logger } from "../logs";

// Axios
export const axiosInstance = axios.create({
    timeout: 10000,
});

// Axios Request Interceptors
axiosInstance.interceptors.request.use(
    (request) => {
        logger.info(`SEND REQUEST, URL: ${request.url}, METHOD: ${request.method}, DATA: ${JSON.stringify(request.data)}, HEADERS: ${JSON.stringify(request.headers)}`);
        return request;
    },
    (error) => {
        logger.error(`SEND REQUEST ERROR, ERROR: ${error.message}`);
        return Promise.reject(error);
    },
);

// Axios Response Interceptors
axiosInstance.interceptors.response.use(
    (response) => {
        logger.info(`RECEIVED RESPONSE, DATA: ${JSON.stringify(response.data)}, HEADERS: ${JSON.stringify(response.headers)}`);
        return response;
    },
    (error) => {
        logger.error(`RECEIVED RESPONSE ERROR, ERROR: ${error.message}`);
        return Promise.reject(error);
    },
);
