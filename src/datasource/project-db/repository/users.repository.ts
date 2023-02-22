// Import Modules
import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Import Entity
import { Users } from '../models/users.entity';

@Injectable()
export class UsersRepository {
    constructor(@InjectRepository(Users) private readonly usersModels: Repository<Users>) {}

    async findAll(): Promise<Users[]> {
        return await this.usersModels.find();
    }
}
