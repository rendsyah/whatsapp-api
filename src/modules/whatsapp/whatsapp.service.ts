// Import Modules
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Client, Message } from 'whatsapp-web.js';
import * as qrCode from 'qrcode-terminal';
import * as fs from 'fs';
import * as appRoot from 'app-root-path';

// Import Commons
import { HelperService } from '@commons/lib/helper/helper.service';
import { ApiBadRequestException } from '@commons/exception/api-exception';

// Import Datasource
import { MongoDbService } from '@datasource/mongo-db/mongo-db.service';
import { apiLoggerService } from '@commons/logger';

// Import Dto
import { WhatsappSendMessageDto } from './dto/whatsapp.dto';

// Import Interfaces
import { IMongoDbModels } from '@datasource/interfaces/mongo-db.interface';
import { IWhatsappReceiveMessage, IWhatsappSendMessageConsumer } from './interfaces/whatsapp.interface';

@Injectable()
export class WhatsappService implements OnModuleInit {
    private readonly whatsappNumber = this.configService.get('app.SERVICE_WHATSAPP_NUMBER');
    private readonly logger = new Logger('Whatsapp');
    private readonly mongoDbModels: IMongoDbModels;

    constructor(
        @Inject('whatsapp-client') private readonly whatsappClient: Client,
        @InjectQueue('receive-message') private readonly receiveMessageQueue: Queue,
        @InjectQueue('send-message') private readonly sendMessageQueue: Queue,
        private readonly mongoDbService: MongoDbService,
        private readonly configService: ConfigService,
        private readonly helperService: HelperService,
    ) {
        this.mongoDbModels = this.mongoDbService.getModels();
    }

    async onModuleInit(): Promise<void> {
        this.whatsappClient.initialize();

        this.whatsappClient.on('qr', async (qr): Promise<void> => {
            this.logger.log('Whatsapp QR Code received');
            qrCode.generate(qr, { small: true });
        });

        this.whatsappClient.on('authenticated', async (): Promise<void> => {
            this.logger.log('Whatsapp authentication success');
        });

        this.whatsappClient.on('ready', async (): Promise<void> => {
            await this._whatsappReceiveUnreadMessage(this.whatsappClient);

            const getVersion = await this.whatsappClient.getWWebVersion();
            const getInfo = this.whatsappClient.info.pushname;

            this.logger.log('Whatsapp connection ready');
            this.logger.log(`Whatsapp connected to ${getInfo}`);
            this.logger.log(`Whatsapp version ${getVersion}`);
        });

        this.whatsappClient.on('message', async (message): Promise<void> => {
            await this.whatsappReceiveMessage(message);
        });

        this.whatsappClient.on('message_ack', async (message): Promise<void> => {
            await this._whatsappReceiveStatusMessage(message);
        });

        this.whatsappClient.on('change_state', async (state): Promise<void> => {
            this.logger.warn(`Whatsapp connection ${state.toLowerCase()}`);
        });

        this.whatsappClient.on('disconnected', async (): Promise<void> => {
            this.logger.log('Whatsapp disconnect');
            await this.whatsappClient.destroy();
            await this.whatsappClient.initialize();
        });
    }

    private async _whatsappReceiveUnreadMessage(client: Client): Promise<void> {
        try {
            const getChats = await client.getChats();
            for (let index = 0; index < getChats.length; index++) {
                let getUnreadCount = getChats[index].unreadCount;
                if (getUnreadCount > 0) {
                    const getUnreadChats = await getChats[index].fetchMessages({ limit: getUnreadCount });
                    for (let index = 0; index < getUnreadChats.length; index++) {
                        const getChat = getUnreadChats[index];
                        await this.receiveMessageQueue.add({ message: getChat });
                    }
                }
            }
        } catch (error) {
            apiLoggerService.error(error, 'WhatsappReceiveUnread');
        }
    }

    private async _whatsappReceiveStatusMessage(message: Message): Promise<void> {
        try {
            const getSender = this.helperService.validateString(message?.to, 'numeric');
            const getAck = message?.ack ? message.ack : 0;

            if (getAck === 2) {
                await this.mongoDbModels.OutgoingModels.updateBulk({ to: getSender, isAck: 0 }, { $set: { status: 'sent', isAck: 2 } });
            }

            if (getAck === 3) {
                await this.mongoDbModels.OutgoingModels.updateBulk(
                    { to: getSender, isAck: { $in: [0, 2] } },
                    { $set: { status: 'read', isAck: 3 } },
                );
            }
        } catch (error) {
            apiLoggerService.error(error, 'WhatsappReceiveStatus');
        }
    }

    async whatsappReceiveMessage(message: Message): Promise<IWhatsappReceiveMessage> {
        try {
            const getContact = await message?.getContact();
            const getSender = this.helperService.validateString(message?.from, 'numeric');
            const getName = this.helperService.validateString(getContact?.pushname, 'emoji');
            const getMessage = message?.body ? message.body : '';
            const getMedia = message?.hasMedia ? await this.whatsappDownloadMedia(message) : '';
            const getRcvdTime = this.helperService.validateTime(new Date(), 'date-time-1');
            const getPlatform = message?.deviceType ? message.deviceType : '';
            const getAck = message?.ack ? message.ack : 0;

            if (!getSender || !getPlatform) {
                await this.whatsappSendMessage({ sender: getSender, message: 'send message failed. please try again...' });
                return;
            }

            await this.mongoDbModels.IncomingModels.create({
                mediaId: 300,
                from: getSender,
                to: this.whatsappNumber,
                message: getMessage,
                attachment: getMedia,
                rcvdTime: getRcvdTime,
                platform: getPlatform,
                status: 'received',
                isAck: getAck,
            });

            return {
                sender: getSender,
                name: getName,
                message: getMessage,
                photo: getMedia,
                media: 300,
                rcvdTime: getRcvdTime,
            };
        } catch (error) {
            this.logger.error(error, 'WhatsappReceiveMessage');
        }
    }

    async whatsappDownloadMedia(message: Message): Promise<string> {
        try {
            const mediaFile = await message?.downloadMedia();
            const mediaFileMimeType = mediaFile.mimetype?.split('/');
            const mediaFileType = mediaFileMimeType ? mediaFileMimeType[0] : '';
            const mediaFileExtension = mediaFile?.filename ? mediaFile.filename.split('.')[1] : mediaFileMimeType[1];
            const mediaFileData = mediaFile?.data ? mediaFile.data : '';

            if (!mediaFileType || !mediaFileExtension || !mediaFileData) {
                await this.whatsappSendMessage({ sender: message.from, message: 'send media failed. please try again...' });
            }

            const dateFormat = this.helperService.validateTime(new Date(), 'date-time-2');
            const randomChar = this.helperService.validateRandomChar(10, 'alphanumeric');
            const mediaPath = this.configService.get('app.SERVICE_UPLOAD_PATH');
            const mediaFilePath = `${appRoot}/..${mediaPath}/${mediaFileType}`;
            const mediaFilename = `${dateFormat}_${randomChar}.${mediaFileExtension}`;
            const mediaFileSave = `${mediaFilePath}/${mediaFilename}`;

            if (!fs.existsSync(mediaFilePath)) {
                fs.mkdirSync(mediaFilePath, { recursive: true });
            }

            fs.writeFileSync(mediaFileSave, mediaFileData, 'base64');

            return mediaFilename;
        } catch (error) {
            this.logger.error(error, 'WhatsappDownloadMedia');
        }
    }

    async whatsappSendMessage(dto: WhatsappSendMessageDto): Promise<string> {
        const currentDatetime = this.helperService.validateTime(new Date(), 'date-time-1');
        const isRegisteredUser = await this.whatsappClient.isRegisteredUser(dto.sender);

        if (!isRegisteredUser) {
            throw new ApiBadRequestException(['sender'], 'whatsapp number not registered');
        }

        const requestConsumer: IWhatsappSendMessageConsumer = {
            from: this.whatsappNumber,
            sender: dto.sender,
            message: dto.message,
            sentTime: currentDatetime,
        };

        await this.sendMessageQueue.add(requestConsumer, { attempts: 10, backoff: 5000, timeout: 30000 });

        return 'sending on process';
    }
}
