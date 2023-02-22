// Import Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Import Mongoose Config
import { MongooseConfigAsync } from './mongoose.config';

@Module({
    imports: [MongooseModule.forRootAsync(MongooseConfigAsync)],
})
export class MongooseConfigModule {}
