// Import Modules
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

// Import Limiter Config
import { LimiterConfigAsync } from './limiter.config';

@Module({
    imports: [ThrottlerModule.forRootAsync(LimiterConfigAsync)],
})
export class LimiterConfigModule {}
