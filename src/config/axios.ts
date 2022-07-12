import axios from "axios";

// LOGGER
import { logger } from "./logger";

const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use(
    (request) => {
        logger.info(`url: ${request.url} - method: ${request.method} - data: ${JSON.stringify(request.data)}`);
        return request;
    },
    (error) => {
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
    (response) => {
        logger.info(`status: ${response.status} - statusText: ${response.statusText} - data: ${JSON.stringify(response.data)}`);
        return response;
    },
    (error) => {
        Promise.reject(error);
    },
);

export default axiosInstance;
