// Import Modules
import { Injectable } from '@nestjs/common';

// Import Interfaces
import { IProjectDbModels } from './interfaces/project-db.interface';

// Import Repository
import { UsersRepository } from './repository/users.repository';

@Injectable()
export class ProjectDbService {
    constructor(private readonly usersRepository: UsersRepository) {}

    getModels(): IProjectDbModels {
        return {
            UsersModel: this.usersRepository,
        };
    }
}
