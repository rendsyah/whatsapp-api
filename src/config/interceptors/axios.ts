import axios from "axios";

// LOGGER
import logger from "../logs";

const axiosInstance = axios.create({
    timeout: 30000,
});

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

export default axiosInstance;
