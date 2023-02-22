// Import Modules
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

// Import Bull Config
import { RedisConfigAsync } from './bull.config';

@Module({
    imports: [BullModule.forRootAsync(RedisConfigAsync)],
})
export class RedisConfigModule {}
