// Import Modules
import { ConfigService } from '@nestjs/config';
import { Client, LocalAuth } from 'whatsapp-web.js';

// Define Whatsapp Init Provider
export const whatsappProviders = {
    provide: 'whatsapp-client',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        return new Client({
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            },
            qrMaxRetries: 30000,
            authTimeoutMs: 60000,
            authStrategy: new LocalAuth({
                clientId: configService.get('app.SERVICE_WHATSAPP_AUTH_CLIENT'),
                dataPath: configService.get('app.SERVICE_WHATSAPP_AUTH_PATH'),
            }),
        });
    },
};
