// Import Modules
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

// Import Limiter Config
import { LimiterConfigAsync } from './limiter.config';

// Define Limiter Config Module
@Module({
    imports: [ThrottlerModule.forRootAsync(LimiterConfigAsync)],
})

// Export Limiter Config Module
export class LimiterConfigModule {}
