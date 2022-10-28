// Modules
import Queue from "bull";

// Interfaces
import { IRequestReplyService } from "./whatsapp.interface";

// Commons
import { createQueue } from "../../config/queues";
import { axiosInstance as axios } from "../../config/interceptors/axios";

// Services
import { whatsappReplyService } from "./whatsapp.service";

// Whatsapp Environments
const WHATSAPP_API_CONNECT = process.env.WHATSAPP_API_CONNECT as string;

// Whatsapp Define Queues
export const connectQueue = createQueue("Connect Queue");
export const replyQueue = createQueue("Reply Queue");

// Whatsapp Connect Queue
const whatsappConnectQueue = async () => {
    connectQueue.process("Connect Process Queue", async (job: Queue.Job): Promise<unknown> => {
        return await axios
            .post(WHATSAPP_API_CONNECT, { ...job.data })
            .then((v) => v?.data)
            .catch((error) => {
                throw new Error(error);
            });
    });

    connectQueue.on("failed", (job: Queue.Job, error: Error): void => {
        job.progress(50);
        job.log(`Error: ${job.failedReason || job.stacktrace[0] || error}`);
    });

    connectQueue.on("completed", async (job: Queue.Job, result): Promise<unknown> => {
        const requestReplyService: IRequestReplyService = {
            to: job.data.sender,
            message: result?.data?.reply ?? result?.message,
            media: "",
            type: "chat",
        };

        if (requestReplyService.message === "success") {
            return "ok";
        }

        await replyQueue.add("Reply Process Queue", requestReplyService, { attempts: 3, backoff: 5000, timeout: 60000 });

        job.progress(100);
        job.log(`Success: ${JSON.stringify(result)}`);
    });
};

// Whatsapp Message Queue
const whatsappReplyQueue = async () => {
    replyQueue.process("Reply Process Queue", async (job: Queue.Job): Promise<unknown> => {
        return whatsappReplyService({ ...job.data });
    });

    replyQueue.on("failed", (job: Queue.Job, error: Error): void => {
        job.progress(50);
        job.log(`Error: ${job.failedReason || job.stacktrace[0] || error}`);
    });

    replyQueue.on("completed", (job: Queue.Job, result): void => {
        job.progress(100);
        job.log(`Success: ${JSON.stringify(result)}`);
    });
};

(async () => {
    await whatsappConnectQueue();
    await whatsappReplyQueue();
})();
