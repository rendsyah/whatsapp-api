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

// Whatsapp Connect Queue
const whatsappConnectQueue = (): Queue.Queue => {
    const queue = createQueue("Connect Queue");

    queue.process("Connect Process Queue", async (job: Queue.Job): Promise<string> => {
        // Connect Service With Body
        const responseData = await axios.post(WHATSAPP_API_CONNECT, { ...job.data });

        // Connect Service With Params
        // const responseData = await axios.get(
        //     `${WHATSAPP_API_CONNECT}?name=${waName}&sender=${waSender}&message=${waMessage}&timestamp=${waTimestamp}`,
        // );

        return responseData.data;
    });

    queue.on("failed", async (job: Queue.Job, error: Error): Promise<void> => {
        job.progress(50);
        job.log(`Error: ${job.failedReason || job.stacktrace[0] || error}`);
    });

    queue.on("completed", async (job: Queue.Job, result): Promise<void> => {
        const completedQueue = await job.finished();
        const requestReplyService: IRequestReplyMessageService = {
            to: job.data.sender,
            type: "text/individual",
            body: {
                message: result?.message ?? result?.data?.reply ?? "",
            },
        };

        await whatsappReplyService(requestReplyService);

        job.progress(100);
        job.log(`Success: ${JSON.stringify(completedQueue)}`);
    });

    return queue;
};

// Whatsapp Message Queue
const whatsappMessageQueue = (): Queue.Queue => {
    const queue = createQueue("Message Queue");

    queue.process("Message Process Queue", (job: Queue.Job): Promise<unknown> => {
        return whatsappReplyService({ ...job.data });
    });

    queue.on("failed", async (job: Queue.Job, error: Error): Promise<void> => {
        job.progress(50);
        job.log(`Error: ${job.failedReason || job.stacktrace[0] || error}`);
    });

    queue.on("completed", async (job: Queue.Job, result): Promise<void> => {
        try {
            const completedQueue = await job.finished();
            job.progress(100);
            job.log(`Success: ${JSON.stringify(completedQueue)}`);
        } catch (error) {
            throw error;
        }
    });

    return queue;
};

export { whatsappConnectQueue, whatsappMessageQueue };
