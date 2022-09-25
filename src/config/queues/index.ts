// Modules
import Queue from "bull";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";

// Whatsapp Queue Environments
const DATABASE_REDIS_HOST = process.env.DATABASE_REDIS_HOST as string;

export const createQueue = (name: string): Queue.Queue => {
    return new Queue(name, DATABASE_REDIS_HOST);
};

export const configQueues = (queue: Queue.Queue[]) => {
    const bullAdapter = [];

    for (let index = 0; index < queue.length; index++) {
        bullAdapter.push(new BullAdapter(queue[index]));
    }

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath("/admin/queues");

    createBullBoard({ queues: bullAdapter, serverAdapter });

    return serverAdapter;
};
