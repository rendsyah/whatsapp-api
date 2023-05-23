// Import Modules
import { Injectable } from '@nestjs/common';

// Import Interfaces
import { IMongoDbModels } from '@datasource/interfaces/mongo-db.interface';

// Import Repository
import { IncomingRepository, OutgoingRepository, TemplateRepository } from './repository';
import { UsersRepository } from './repository/users.repository';

@Injectable()
export class MongoDbService {
    constructor(
        private readonly incomingRepository: IncomingRepository,
        private readonly outgoingRepository: OutgoingRepository,
        private readonly templateRepository: TemplateRepository,
        private readonly usersRepository: UsersRepository,
    ) {}

    getModels(): IMongoDbModels {
        return {
            IncomingModels: this.incomingRepository,
            OutgoingModels: this.outgoingRepository,
            TemplateModels: this.templateRepository,
            UsersModels: this.usersRepository,
        };
    }
}
