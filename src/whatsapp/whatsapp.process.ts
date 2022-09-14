// Modules
import Queue from "bull";
import { createBullBoard } from "bull-board";
import { BullAdapter } from "bull-board/bullAdapter";

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
    connectQueue: new Queue("Connect Service", DATABASE_REDIS_HOST, { defaultJobOptions: { attempts: 10, backoff: 5000, timeout: 60000 } }),
};

export const bullRouter = createBullBoard([new BullAdapter(queues.connectQueue)]);

const whatsappConnectProcess = async (params: IWhatsappConnectProcess): Promise<string> => {
    // Connect Service With Body
    const responseConnectService = await axios.post(WHATSAPP_API_CONNECT, { ...params });

    // Connect Service With Params
    // const responseConnectService = await axios.get(`${WHATSAPP_API_CONNECT}?name=${waName}&sender=${waSender}&message=${waMessage}&timestamp=${waTimestamp}`);

    // NestJs
    // const responseDataMessage = responseConnectService.data?.data?.reply ?? "something went wrong...";

    // ExpressJs
    const responseDataMessage = responseConnectService.data?.message ?? "something went wrong...";

    const requestSendMessage = {
        whatsappClient,
        sender: params.sender,
        message: responseDataMessage,
    };

    await sendRequestMessage(requestSendMessage as ISendMessage);

    return responseDataMessage;
};

queues.connectQueue.process((job: Queue.Job): Promise<string> => {
    return whatsappConnectProcess({ ...job.data });
});

queues.connectQueue.on("completed", async (job: Queue.Job, result: string) => {
    job.progress(100);
});

queues.connectQueue.on("failed", (job: Queue.Job, reason: string) => {
    job.log(`Reason: ${reason}`);
    job.progress(50);
});
