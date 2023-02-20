// Import Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Import Mongoose Config
import { mongooseConfigAsync } from './mongoose.config';

@Module({
    imports: [MongooseModule.forRootAsync(mongooseConfigAsync)],
})
export class MongooseConfigModule {}
