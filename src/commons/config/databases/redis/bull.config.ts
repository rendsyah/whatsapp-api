// Import Modules
import { BullModuleOptions, SharedBullAsyncConfiguration, SharedBullConfigurationFactory } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Define Bull Options
export class RedisConfig implements SharedBullConfigurationFactory {
    constructor(private readonly configService: ConfigService) {}

    createSharedConfiguration(): BullModuleOptions {
        return {
            redis: {
                host: this.configService.get('db.SERVICE_REDIS_HOST'),
                port: +this.configService.get('db.SERVICE_REDIS_PORT'),
            },
        };
    }
}

// Define Bull Config
export const RedisConfigAsync: SharedBullAsyncConfiguration = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<BullModuleOptions> => {
        return new RedisConfig(configService).createSharedConfiguration();
    },
};
