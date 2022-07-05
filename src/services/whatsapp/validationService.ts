import axios from "axios";

export const validationService = ({ ...request }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const body = {
                message: request.message,
                sender: request.sender,
                media: request.media,
                rcvdTime: request.rcvdTime,
                sessionId: request.sessionId,
            };

            const response = await axios.post(request.url, body);
            return resolve(response);
        } catch (error) {
            reject(error);
        }
    });
};
