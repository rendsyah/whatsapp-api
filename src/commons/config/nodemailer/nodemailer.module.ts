// Import Modules
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

// Import Nodemailer Config
import { NodemailerConfigAsync } from './nodemailer.config';

// Define Nodemailer Config Module
@Module({
    imports: [MailerModule.forRootAsync(NodemailerConfigAsync)],
})

// Export Nodemailer Config Module
export class NodemailerConfigModule {}
