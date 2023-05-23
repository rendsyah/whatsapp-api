// Import Modules
import { InjectQueue, OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Queue } from 'bull';
import { Client } from 'whatsapp-web.js';
import axios from 'axios';

// Import Commons
import { HelperService } from '@commons/lib/helper/helper.service';

// Import Datasouce
import { MongoDbService } from '@datasource/mongo-db/mongo-db.service';

// Import Interfaces
import {
    IWhatsappReceiveMessageConsumer,
    IWhatsappReceiveMessageResponse,
    IWhatsappSendMessageConsumer,
    IWhatsappSendMessageResponse,
} from './interfaces/whatsapp.interface';
import { IMongoDbModels } from '@datasource/interfaces/mongo-db.interface';

@Processor('receive-message')
export class WhatsappReceiveMessageConsumer {
    constructor(
        @InjectQueue('send-message') private readonly sendMessageQueue: Queue,
        private readonly configService: ConfigService,
        private readonly helperService: HelperService,
    ) {}

    @Process()
    async receiveMessageQueue(job: Job<IWhatsappReceiveMessageConsumer>): Promise<IWhatsappReceiveMessageResponse> {
        const { sender, name, message, photo, rcvdTime } = job.data;

        const request = {
            sender: sender,
            name: name,
            message: this.helperService.validateString(message, 'encode'),
            photo: this.helperService.validateString(photo, 'encode'),
            timestamp: rcvdTime,
        };

        const connectUrl = this.configService.get('app.SERVICE_CONNECT_URL');
        const response = await axios.post(connectUrl, request);

        const getResponseMessage = response.data.data?.reply || '';

        return {
            sender: sender,
            message: getResponseMessage,
        };
    }

    @OnQueueCompleted()
    async receiveMessageCompleted(job: Job<IWhatsappReceiveMessageConsumer>, result: IWhatsappReceiveMessageResponse): Promise<void> {
        await this.sendMessageQueue.add(result);
    }
}

@Processor('send-message')
export class WhatsappSendMessageConsumer {
    private readonly mongoDbModels: IMongoDbModels;

    constructor(
        @Inject('whatsapp-client') private readonly whatsappClient: Client,
        private readonly mongoDbService: MongoDbService,
        private readonly helperService: HelperService,
    ) {
        this.mongoDbModels = this.mongoDbService.getModels();
    }

    @Process()
    async process(job: Job<IWhatsappSendMessageConsumer>): Promise<IWhatsappSendMessageResponse> {
        const { from, sender, message } = job.data;

        const currentDatetime = this.helperService.validateTime(new Date(), 'date-time-1');
        const formatSender = this.helperService.validateReplacePhone(sender, '62');
        const response = await this.whatsappClient.sendMessage(formatSender, message);
        await this.mongoDbModels.OutgoingModels.create({
            from: from,
            to: sender,
            message: message,
            attachment: '',
            sentTime: currentDatetime,
            isAck: 0,
            status: 'pending',
        });

        return response.id;
    }
}
