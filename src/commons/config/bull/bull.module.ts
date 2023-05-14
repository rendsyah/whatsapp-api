// Import Modules
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

// Import Bull Config
import { BullConfigAsync } from './bull.config';

// Define Bull Config Module
@Module({
    imports: [BullModule.forRootAsync(BullConfigAsync)],
})

// Export Bull Config Module
export class BullConfigModule {}
