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
    IWhatsappReceiveMessage,
    IWhatsappReceiveMessageConsumer,
    IWhatsappReceiveMessageResponse,
    IWhatsappSendMessageConsumer,
    IWhatsappSendMessageResponse,
} from './interfaces/whatsapp.interface';
import { IMongoDbModels } from '@datasource/interfaces/mongo-db.interface';

// Import Service
import { WhatsappService } from './whatsapp.service';

@Processor('receive-message')
export class WhatsappReceiveMessageConsumer {
    constructor(
        @InjectQueue('send-message') private readonly sendMessageQueue: Queue,
        private readonly configService: ConfigService,
        private readonly helperService: HelperService,
        private readonly whatsappService: WhatsappService,
    ) {}

    @Process()
    async receiveMessageQueue(job: Job<IWhatsappReceiveMessageConsumer>): Promise<IWhatsappReceiveMessageResponse> {
        const { message } = job.data;

        const receivedMessage = await this.whatsappService.whatsappReceiveMessage(message);

        const request = {
            sender: receivedMessage.sender,
            name: receivedMessage.name,
            message: this.helperService.validateString(receivedMessage.message, 'encode'),
            photo: this.helperService.validateString(receivedMessage.photo, 'encode'),
            media: receivedMessage.media,
            timestamp: receivedMessage.rcvdTime,
        };

        const connectUrl = this.configService.get('app.SERVICE_CONNECT_URL');
        const response = await axios.post(connectUrl, request);

        return {
            sender: receivedMessage.sender,
            message: response.data?.data?.reply || '',
        };
    }

    @OnQueueCompleted()
    async receiveMessageCompleted(job: Job<IWhatsappReceiveMessage>, result: IWhatsappReceiveMessageResponse): Promise<void> {
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
        const { from, sender, message, sentTime } = job.data;

        const formatSender = this.helperService.validateReplacePhone(sender, '62');
        const response = await this.whatsappClient.sendMessage(formatSender, message);
        await this.mongoDbModels.OutgoingModels.create({
            mediaId: 300,
            from: from,
            to: sender,
            message: message,
            attachment: '',
            sentTime: sentTime,
            isAck: 0,
            status: 'pending',
        });

        return response.id;
    }
}
