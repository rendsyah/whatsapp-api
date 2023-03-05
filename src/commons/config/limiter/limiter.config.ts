// Import Modules
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerAsyncOptions, ThrottlerModuleOptions, ThrottlerOptionsFactory } from '@nestjs/throttler';

// Define Limiter Options
export class LimiterConfig implements ThrottlerOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createThrottlerOptions(): ThrottlerModuleOptions {
        return {
            ttl: +this.configService.get('app.SERVICE_LIMITER_TTL'),
            limit: +this.configService.get('app.SERVICE_LIMITER_LIMIT'),
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
