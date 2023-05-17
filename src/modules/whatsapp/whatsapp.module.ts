// Import Module
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

// Import Datasource
import { MongoDbModule } from '@datasource/mongo-db/mongo-db.module';

// Import Service
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { whatsappProviders } from './whatsapp.provider';
import { WhatsappReceiveMessageConsumer, WhatsappSendMessageConsumer } from './whatsapp.consumer';

// Define Whatsapp Module
@Module({
    imports: [MongoDbModule, BullModule.registerQueue({ name: 'receive-message' }, { name: 'send-message' })],
    controllers: [WhatsappController],
    providers: [WhatsappService, whatsappProviders, WhatsappReceiveMessageConsumer, WhatsappSendMessageConsumer],
})

// Export Whatsapp Module
export class WhatsappModule {}
