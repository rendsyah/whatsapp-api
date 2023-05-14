// Import Modules
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerAsyncOptions, ThrottlerModuleOptions, ThrottlerOptionsFactory } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

// Define Limiter Options
export class LimiterConfig implements ThrottlerOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    public createThrottlerOptions(): ThrottlerModuleOptions {
        return {
            ttl: +this.configService.get<string>('app.SERVICE_LIMITER_TTL'),
            limit: +this.configService.get<string>('app.SERVICE_LIMITER_LIMIT'),
            storage: new ThrottlerStorageRedisService({
                host: this.configService.get<string>('db.SERVICE_REDIS_HOST'),
                port: +this.configService.get<string>('db.SERVICE_REDIS_PORT'),
            }),
        };
    }
}

// Define Limiter Config
export const LimiterConfigAsync: ThrottlerAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<ThrottlerModuleOptions> => {
        return new LimiterConfig(configService).createThrottlerOptions();
    },
};
