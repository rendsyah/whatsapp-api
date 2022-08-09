import axios from "axios";

// LOGGER
import logger from "../logs";

const axiosInstance = axios.create({
    timeout: 30000,
});

axiosInstance.interceptors.request.use(
    (request) => {
        logger.info(`SEND REQUEST, url: ${request.url}, method: ${request.method}, data: ${JSON.stringify(request.data)}, headers: ${JSON.stringify(request.headers)}`);
        return request;
    },
    (error) => {
        logger.error(`SEND REQUEST ERROR, error: ${error.message}`);
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
    (response) => {
        logger.info(`RECEIVED RESPONSE, data: ${JSON.stringify(response.data)}, headers: ${JSON.stringify(response.headers)}`);
        return response;
    },
    (error) => {
        logger.error(`RECEIVED RESPONSE ERROR, error: ${error.message}`);
        return Promise.reject(error);
    },
);

export default axiosInstance;
