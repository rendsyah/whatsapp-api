// Import Modules
import { MailerOptionsFactory } from '@nestjs-modules/mailer';
import { MailerOptions } from '@nestjs-modules/mailer/dist';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Define Nodemailer Options
export class NodemailerConfig implements MailerOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    public createMailerOptions(): MailerOptions {
        return {
            transport: {
                host: this.configService.get<string>('app.SERVICE_EMAIL_HOST'),
                secure: false,
                auth: {
                    user: this.configService.get<string>('app.SERVICE_EMAIL_USER'),
                    pass: this.configService.get<string>('app.SERVICE_EMAIL_PASS'),
                },
            },
            defaults: {
                from: `No Reply <${this.configService.get<string>('app.SERVICE_EMAIL_FROM')}>`,
            },
            template: {
                dir: __dirname + '/templates',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        };
    }
}

// Define Nodemailer Config
export const NodemailerConfigAsync: MailerAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<MailerOptions> => {
        return new NodemailerConfig(configService).createMailerOptions();
    },
};
