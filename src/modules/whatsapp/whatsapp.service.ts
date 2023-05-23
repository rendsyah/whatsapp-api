// Import Modules
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Client, Message } from 'whatsapp-web.js';
import * as qrCode from 'qrcode-terminal';
import * as fs from 'fs';
import * as appRoot from 'app-root-path';
import * as csv from 'fast-csv';

// Import Commons
import { HelperService } from '@commons/lib/helper/helper.service';
import { ApiBadRequestException, ApiNotFoundException } from '@commons/exception/api-exception';

// Import Datasource
import { MongoDbService } from '@datasource/mongo-db/mongo-db.service';
import { apiLoggerService } from '@commons/logger';

// Import Dto
import { WhatsappBlastMessageDto, WhatsappSendMessageDto } from './dto/whatsapp.dto';

// Import Interfaces
import { IMongoDbModels } from '@datasource/interfaces/mongo-db.interface';
import { IWhatsappSendMessageConsumer } from './interfaces/whatsapp.interface';
import { Response } from 'express';

@Injectable()
export class WhatsappService implements OnModuleInit {
    private readonly whatsappNumber = this.configService.get('app.SERVICE_WHATSAPP_NUMBER');
    private readonly mongoDbModels: IMongoDbModels;
    private readonly logger = new Logger('Whatsapp');

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

    /**
     * Handle module init
     * @publicApi
     * @returns Promise<void>
     */
    async onModuleInit(): Promise<void> {
        this.whatsappClient.on('qr', (qr): void => {
            this.logger.log('Whatsapp QR Code received');
            qrCode.generate(qr, { small: true });
        });

        this.whatsappClient.on('authenticated', (): void => {
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

        this.whatsappClient.on('change_state', (state): void => {
            this.logger.warn(`Whatsapp connection ${state.toLowerCase()}`);
        });

        this.whatsappClient.on('disconnected', (): void => {
            this.logger.log('Whatsapp disconnect');
            this.whatsappClient.destroy();
            this.whatsappClient.initialize();
        });

        this.whatsappClient.initialize();
    }

    /**
     * Handle to get unread message
     * @privateApi
     * @param client @interface Client
     * @returns Promise<void>
     */
    private async _whatsappReceiveUnreadMessage(client: Client): Promise<void> {
        try {
            const getChats = await client.getChats();
            for (let index = 0; index < getChats.length; index++) {
                let getUnreadCount = getChats[index].unreadCount;
                if (getUnreadCount > 0) {
                    const getUnreadChats = await getChats[index].fetchMessages({ limit: getUnreadCount });
                    for (let index = 0; index < getUnreadChats.length; index++) {
                        const getMessage = getUnreadChats[index];
                        await this.whatsappReceiveMessage(getMessage);
                    }
                }
            }
        } catch (error) {
            apiLoggerService.error(error, { service: 'unread-message' });
        }
    }

    /**
     * Handle to get status message
     * @privateApi
     * @param message @interface Message
     * @returns Promise<void>
     */
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
            apiLoggerService.error(error, { service: 'status-message' });
        }
    }

    /**
     * Handle to get message
     * @publicApi
     * @param message @interface Message
     * @returns Promise<void>
     */
    async whatsappReceiveMessage(message: Message): Promise<void> {
        try {
            const getContact = (await message?.getContact())?.pushname || '';
            const getSender = this.helperService.validateString(message?.from, 'numeric');
            const getName = this.helperService.validateString(getContact, 'emoji');
            const getMessage = message?.body ? message.body : '';
            const getMedia = message?.hasMedia ? await this.whatsappDownloadMedia(message) : '';
            const getRcvdTime = this.helperService.validateTime(new Date(), 'date-time-1');
            const getPlatform = message?.deviceType ? message.deviceType : '';
            const getAck = message?.ack ? message.ack : 0;

            const getUser = await this.mongoDbModels.UsersModels.findOne({ phone: getSender });

            if (!getSender || !getPlatform) {
                await this.sendMessageQueue.add({
                    sender: getSender,
                    from: this.whatsappNumber,
                    message: 'send message failed. please try again...',
                });

                return;
            }

            if (!getUser) {
                await this.mongoDbModels.UsersModels.create({ name: getName, phone: getSender });
            }

            await this.mongoDbModels.IncomingModels.create({
                from: getSender,
                to: this.whatsappNumber,
                message: getMessage,
                attachment: getMedia,
                rcvdTime: getRcvdTime,
                platform: getPlatform,
                status: 'received',
                isAck: getAck,
            });

            // Uncomment for connect integration
            // await this.receiveMessageQueue.add({
            //     sender: getSender,
            //     name: getName,
            //     message: getMessage,
            //     photo: getMedia,
            //     rcvdTime: getRcvdTime,
            // });
        } catch (error) {
            apiLoggerService.error(error, { service: 'receive-message' });
        }
    }

    /**
     * Handle to download media
     * @publicApi
     * @param message @interface Message
     * @returns Promise<string>
     */
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
            apiLoggerService.error(error, { service: 'download-media' });
        }
    }

    /**
     * Handle to download template
     * @publicApi
     * @param res @interface Response
     * @returns Promise<void>
     */
    async whatsappDownloadTemplate(res: Response): Promise<void> {
        const getFilePath = this.configService.get('app.SERVICE_DOWNLOAD_PATH');
        const getFileTemplate = `${appRoot}${getFilePath}/template.csv`;
        const getReadStream = fs.createReadStream(getFileTemplate);

        getReadStream.pipe(res);
    }

    /**
     * Handle to send message
     * @publicApi
     * @param dto @interface WhatsappSendMessageDto
     * @returns Promise<string>
     */
    async whatsappSendMessage(dto: WhatsappSendMessageDto): Promise<string> {
        const isRegisteredUser = await this.whatsappClient.isRegisteredUser(dto.sender);

        if (!isRegisteredUser) {
            throw new ApiBadRequestException(['sender'], 'whatsapp number not registered');
        }

        const requestConsumer: IWhatsappSendMessageConsumer = {
            from: this.whatsappNumber,
            sender: dto.sender,
            message: dto.message,
        };

        await this.sendMessageQueue.add(requestConsumer, { attempts: 10, backoff: 5000, timeout: 30000 });

        return 'sending on process';
    }

    /**
     * Handle to blast message
     * @publicApi
     * @param dto @interface WhatsappBlastMessageDto
     * @returns Promise<string>
     */
    async whatsappBlastMessage(dto: WhatsappBlastMessageDto): Promise<string> {
        const getTemplate = dto.template;
        const getPath = dto.file.path;
        const getTemplateMessage = await this.mongoDbModels.TemplateModels.findOne({ name: getTemplate, status: 1 });

        if (!getTemplateMessage) {
            throw new ApiNotFoundException(['template'], 'data not found');
        }

        const getMessage = getTemplateMessage.message;

        fs.createReadStream(getPath)
            .pipe(csv.parse({ headers: true }))
            .on('error', (error) => apiLoggerService.error(error))
            .on('data', async (row) => {
                const getName = row.name;
                const getPhone = row.phone;
                const getReplaceMessage = this.helperService.validateReplaceMessage(getMessage, [getName]);

                const requestConsumer: IWhatsappSendMessageConsumer = {
                    from: this.whatsappNumber,
                    sender: getPhone,
                    message: getReplaceMessage,
                };

                await this.sendMessageQueue.add(requestConsumer, { attempts: 10, backoff: 5000, timeout: 30000 });
            })
            .on('end', (rowCount: number) => apiLoggerService.info(`Parsed ${rowCount} rows`));

        return 'blast on process';
    }
}
