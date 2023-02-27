// Import Modules
import { Injectable } from '@nestjs/common';

// Import Repository
import { AccessRepository } from './repository';
import { UsersRepository } from './repository/users.repository';

// Import Interfaces
import { IGetProjectDbModels } from '@datasource/interfaces/project-db.interface';

@Injectable()
export class ProjectDbService {
    constructor(private readonly accessRepository: AccessRepository, private readonly usersRepository: UsersRepository) {}

    getModels(): IGetProjectDbModels {
        return {
            AccessModels: this.accessRepository,
            UsersModels: this.usersRepository,
        };
    }
}
