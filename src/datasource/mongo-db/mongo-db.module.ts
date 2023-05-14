// Import Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Import Entity
import { LogsDbEntitiesModels } from './models/models';

// Import Service
import { MongoDbService } from './mongo-db.service';
import { MongoDbProviders } from './mongo-db.provider';

// Define Mongo DB Module
@Module({
    imports: [MongooseModule.forFeature(LogsDbEntitiesModels)],
    providers: [MongoDbService, ...MongoDbProviders],
    exports: [MongoDbService],
})

// Export Mongo DB Module
export class MongoDbModule {}
