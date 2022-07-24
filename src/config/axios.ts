import axios from "axios";

// LOGGER
import { logger } from "./logger";

const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use(
    (request) => {
        logger.info(`SEND REQUEST, url: ${request.url}, method: ${request.method}, data: ${JSON.stringify(request.data)}, headers: ${JSON.stringify(request.headers)}`);
        return request;
    },
    (error) => {
        logger.error(`SEND REQUEST ERROR, ${error.message}`);
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
    (response) => {
        logger.info(`RECEIVED RESPONSE, status: ${response.status}, data: ${JSON.stringify(response.data)}, headers: ${JSON.stringify(response.headers)}`);
        return response;
    },
    (error) => {
        logger.error(`RECEIVED RESPONSE ERROR, ${error.message}`);
        return Promise.reject(error);
    },
);

export default axiosInstance;
