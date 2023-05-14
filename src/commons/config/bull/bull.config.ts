// Import Modules
import { BullModuleOptions, SharedBullAsyncConfiguration, SharedBullConfigurationFactory } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Define Bull Options
export class BullConfig implements SharedBullConfigurationFactory {
    constructor(private readonly configService: ConfigService) {}

    public createSharedConfiguration(): BullModuleOptions {
        return {
            redis: {
                host: this.configService.get<string>('db.SERVICE_REDIS_HOST'),
                port: +this.configService.get<string>('db.SERVICE_REDIS_PORT'),
            },
        };
    }
}

// Define Bull Config
export const BullConfigAsync: SharedBullAsyncConfiguration = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<BullModuleOptions> => {
        return new BullConfig(configService).createSharedConfiguration();
    },
};
