// Import Modules
import { Injectable } from '@nestjs/common';

// Import Repository
import { UsersRepository } from './repository/users.repository';

// Import Interfaces
import { IGetProjectDbModels } from '@datasource/interfaces/project-db.interface';

@Injectable()
export class ProjectDbService {
    constructor(private readonly usersRepository: UsersRepository) {}

    getModels(): IGetProjectDbModels {
        return {
            UsersModels: this.usersRepository,
        };
    }
}
