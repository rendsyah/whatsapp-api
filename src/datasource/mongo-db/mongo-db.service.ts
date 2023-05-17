// Import Modules
import { Injectable } from '@nestjs/common';

// Import Interfaces
import { IMongoDbModels } from '@datasource/interfaces/mongo-db.interface';

// Import Repository
import { IncomingRepository, OutgoingRepository } from './repository';
import { UsersRepository } from './repository/users.repository';

@Injectable()
export class MongoDbService {
    constructor(
        private readonly incomingRepository: IncomingRepository,
        private readonly outgoingRepository: OutgoingRepository,
        private readonly usersRepository: UsersRepository,
    ) {}

    getModels(): IMongoDbModels {
        return {
            IncomingModels: this.incomingRepository,
            OutgoingModels: this.outgoingRepository,
            UsersModels: this.usersRepository,
        };
    }
}
