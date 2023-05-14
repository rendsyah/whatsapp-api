// Import Modules
import { Injectable } from '@nestjs/common';

// Import Interfaces
import { IMongoDbModels } from '@datasource/interfaces/mongo-db.interface';

// Import Repository
import { UsersRepository } from './repository/users.repository';

@Injectable()
export class MongoDbService {
    constructor(private readonly usersRepository: UsersRepository) {}

    getModels(): IMongoDbModels {
        return {
            UsersModels: this.usersRepository,
        };
    }
}
