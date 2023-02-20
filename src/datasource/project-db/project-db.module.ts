// Import Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Import Entity
import { DbEntities } from './entities';

// Import Service
import { ProjectDbService } from './project-db.service';
import { ProjectDbProviders } from './project-db.provider';

@Module({
    imports: [MongooseModule.forFeatureAsync(DbEntities)],
    providers: [ProjectDbService, ...ProjectDbProviders],
    exports: [ProjectDbService],
})
export class ProjectDbModule {}
