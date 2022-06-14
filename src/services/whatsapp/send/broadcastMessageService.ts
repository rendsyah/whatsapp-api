import * as model from "./model";

// INTERFACES
import { IDataBroadcastMessage } from "../../interfaces/interface";

export const broadcastMessageService = (): Promise<IDataBroadcastMessage> => {
    return new Promise(async (resolve, reject) => {
        try {
            const dataNasabah: unknown = await model.getDataNasabah();
            const dataTemplateBroadcastMessage: unknown = (await model.getDataTemplateBroadcastMessage(1)) ?? [];

            if (Array.isArray(dataTemplateBroadcastMessage) && dataTemplateBroadcastMessage.length < 1) {
                return resolve({
                    dataNasabah: [],
                    message: "",
                });
            }

            if (Array.isArray(dataNasabah) && Array.isArray(dataTemplateBroadcastMessage)) {
                const message: string = dataTemplateBroadcastMessage[0].message;
                const resultDataBroadcastMessage = {
                    dataNasabah,
                    message,
                };
                return resolve(resultDataBroadcastMessage);
            }

            return resolve({
                dataNasabah: [],
                message: "",
            });
        } catch (error) {
            reject(error);
        }
    });
};
