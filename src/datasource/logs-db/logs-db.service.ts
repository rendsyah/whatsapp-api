// Import Modules
import { Injectable } from '@nestjs/common';

// Import Interfaces
import { IGetLogsDbModels } from '@datasource/interfaces/logs-db.interface';

// Import Repository
import { UsersRepository } from './repository/users.repository';

@Injectable()
export class LogsDbService {
    constructor(private readonly usersRepository: UsersRepository) {}

    getModels(): IGetLogsDbModels {
        return {
            UsersModels: this.usersRepository,
        };
    }
}
