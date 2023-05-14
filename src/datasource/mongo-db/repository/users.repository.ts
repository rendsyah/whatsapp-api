// Import Modules
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Import Base Repository
import { BaseRepository } from './base.repository';

// Import Entity
import { Users, UsersDocument } from '../models/users.entity';

@Injectable()
export class UsersRepository extends BaseRepository<UsersDocument> {
    constructor(@InjectModel(Users.name) private readonly usersModel: Model<UsersDocument>) {
        super(usersModel);
    }
}
