// Import Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Import Entity
import { LogsDbEntitiesModels } from './models/models';

// Import Service
import { LogsDbService } from './logs-db.service';
import { LogsDbProviders } from './logs-db.provider';

@Module({
    imports: [MongooseModule.forFeature(LogsDbEntitiesModels)],
    providers: [LogsDbService, ...LogsDbProviders],
    exports: [LogsDbService],
})
export class LogsDbModule {}
