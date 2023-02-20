// Import Modules
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

// Import Bull Config
import { redisConfigAsync } from './bull.config';

@Module({
    imports: [BullModule.forRootAsync(redisConfigAsync)],
})
export class RedisConfigModule {}
