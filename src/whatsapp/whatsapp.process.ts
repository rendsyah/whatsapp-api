// Modules
import Queue from "bull";

// Interfaces
import { IWhatsappConnectProcess } from "./whatsapp.interface";
import { ISendMessage } from "../config/lib/interface";

// Commons
import { axiosInstance as axios } from "../config/interceptors/axios";
import { sendRequestMessage } from "../config/lib/baseFunctions";

// Services
import { whatsappClient } from "./whatsapp.service";

// Whatsapp Environments
const WHATSAPP_API_CONNECT = process.env.WHATSAPP_API_CONNECT as string;
const DATABASE_REDIS_HOST = process.env.DATABASE_REDIS_HOST as string;

export const queues = {
    connectQueue: new Queue("Connect Api", DATABASE_REDIS_HOST, { defaultJobOptions: { attempts: 10, backoff: 5000, timeout: 60000 } }),
};

const whatsappConnectProcess = async (params: IWhatsappConnectProcess): Promise<string> => {
    // Connect Service With Body
    const responseConnectService = await axios.post(WHATSAPP_API_CONNECT, { ...params });

    // Connect Service With Params
    // const responseConnectService = await axios.get(`${WHATSAPP_API_CONNECT}?name=${waName}&sender=${waSender}&message=${waMessage}&timestamp=${waTimestamp}`);

    // NestJs
    // const responseDataMessage = responseConnectService.data?.data?.reply ?? "something went wrong...";

    // ExpressJs
    const responseDataMessage = responseConnectService.data?.message ?? "something went wrong...";

    return responseDataMessage;
};

queues.connectQueue.process("connectApi", (job: Queue.Job): Promise<string> => {
    return whatsappConnectProcess({ ...job.data });
});

queues.connectQueue.on("failed", (job: Queue.Job, error) => {
    if (error) {
        for (let index = 0; index < job.stacktrace.length; index++) {
            const reasonError = job.stacktrace[index];
            job.log(`Reason : ${reasonError || job.failedReason}`);
        }
        job.progress(50);
    }
});

queues.connectQueue.on("completed", async (job: Queue.Job, result) => {
    const requestSendMessage = {
        whatsappClient,
        sender: job.data.sender,
        message: result,
    };
    await sendRequestMessage(requestSendMessage as ISendMessage);
    job.progress(100);
});
