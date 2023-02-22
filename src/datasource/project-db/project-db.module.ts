// Import Modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import Entity
import { ProjectDbEntitiesModels } from './models/models';

// Import Service
import { ProjectDbService } from './project-db.service';
import { ProjectDbProviders } from './project-db.provider';

@Module({
    imports: [TypeOrmModule.forFeature(ProjectDbEntitiesModels)],
    providers: [ProjectDbService, ...ProjectDbProviders],
    exports: [ProjectDbService],
})
export class ProjectDbModule {}
