// Modules
import xlsx from "xlsx";
import appRoot from "app-root-path";

// Interfaces
import { IWhatsappBroadcast } from "../whatsapp.interface";
import { ISendMessage } from "../../config/lib/baseFunctions.interface";

// Providers
import { whatsappClient } from "../whatsapp.service";
import { validateRequestParams, validateRequestVariable, sendRequestMessage } from "../../config/lib/baseFunctions";

// Broadcast Environments
const WHATSAPP_UPLOAD_PATH = process.env.WHATSAPP_UPLOAD_PATH as string;

// Whatsapp Broadcast Services
export const whatsappBroadcastService = async (params: IWhatsappBroadcast): Promise<unknown> => {
    try {
        const { namespace, filename } = params;

        const readFile = xlsx.readFile(`${appRoot}/..${WHATSAPP_UPLOAD_PATH}${filename}`, { sheets: "Sheet1" });
        const dataFile: xlsx.Sheet = xlsx.utils.sheet_to_json(readFile.Sheets[readFile.SheetNames[0]], { blankrows: false });

        for (let i = 0; i < dataFile.length; i++) {
            const name = validateRequestParams(dataFile[i]?.name ?? "", "any");
            const sender = validateRequestParams(dataFile[i]?.sender ?? "", "num");
            const message = await validateRequestVariable(namespace, [name]);

            if (!name || !sender) continue;

            const requestBroadcastService = {
                whatsappClient,
                sender,
                message,
            };
            setTimeout(async () => await sendRequestMessage(requestBroadcastService as ISendMessage), i * 40000);
        }
        return { message: "whatsapp broadcast process" };
    } catch (error) {
        throw error;
    }
};

// Whatsapp Broadcast Create Service
export const whatsappBroadcastCreateService = async () => {};

// Whatsapp Broadcast Update Service
export const whatsappBroadcastUpdateService = async () => {};

// Whatsapp Broadcast Delete Service
export const whatsappBroadcastDeleteService = async () => {};

// Whatsapp Broadcast Download Service
export const whatsappBroadcastDownloadService = async () => {};
