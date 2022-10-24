// Modules
import Queue from "bull";

// Interfaces
import { IRequestReplyMessageService } from "./whatsapp.dto";

// Commons
import { createQueue } from "../../config/queues";
import { axiosInstance as axios } from "../../config/interceptors/axios";

// Services
import { whatsappReplyService } from "./whatsapp.service";

// Whatsapp Environments
const WHATSAPP_API_CONNECT = process.env.WHATSAPP_API_CONNECT as string;

// Whatsapp Define Queues
export const connectQueue = createQueue("Connect Queue");
export const messageQueue = createQueue("Message Queue");

// Whatsapp Connect Queue
const whatsappConnectQueue = async () => {
    connectQueue.process("Connect Process Queue", async (job: Queue.Job): Promise<unknown> => {
        const responseData = await axios.post(WHATSAPP_API_CONNECT, { ...job.data });
        return responseData.data;
    });

    connectQueue.on("failed", async (job: Queue.Job, error: Error): Promise<void> => {
        job.progress(50);
        job.log(`Error: ${job.failedReason || job.stacktrace[0] || error}`);
    });

    connectQueue.on("completed", async (job: Queue.Job, result): Promise<void> => {
        const completedQueue = await job.finished();
        const requestReplyService: IRequestReplyMessageService = {
            to: job.data.sender,
            type: "text/individual",
            body: {
                message: result?.data?.reply ?? result?.message,
            },
        };

        await whatsappReplyService(requestReplyService);

        job.progress(100);
        job.log(`Success: ${JSON.stringify(completedQueue)}`);
    });
};

// Whatsapp Message Queue
const whatsappMessageQueue = async () => {
    messageQueue.process("Message Process Queue", async (job: Queue.Job): Promise<unknown> => {
        return whatsappReplyService({ ...job.data });
    });

    messageQueue.on("failed", async (job: Queue.Job, error: Error): Promise<void> => {
        job.progress(50);
        job.log(`Error: ${job.failedReason || job.stacktrace[0] || error}`);
    });

    messageQueue.on("completed", async (job: Queue.Job, result): Promise<void> => {
        const completedQueue = await job.finished();
        job.progress(100);
        job.log(`Success: ${JSON.stringify(completedQueue)}`);
    });
};

(async () => {
    await whatsappConnectQueue();
    await whatsappMessageQueue();
})();
