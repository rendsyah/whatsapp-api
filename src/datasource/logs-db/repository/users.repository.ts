// Import Modules
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Import Entity
import { UsersDocument } from '../models/users.entity';

@Injectable()
export class UsersRepository {
    constructor(@InjectModel('Users') private readonly usersModel: Model<UsersDocument>) {}

    async findAll(): Promise<UsersDocument[]> {
        return await this.usersModel.find();
    }
}
