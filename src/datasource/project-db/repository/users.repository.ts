// Import Modules
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';

// Import Commons
import { HelperService } from '@commons/lib/helper/helper.service';

// Import Entity
import { UsersDocument } from '../entities/users.entity';

// Import Interfaces
import { ICreateUser, IGetOneUser, IUpdateUserLogin } from './interfaces';

@Injectable()
export class UsersRepository {
    constructor(@InjectModel('Users') private readonly usersModel: Model<UsersDocument>, private readonly helperService: HelperService) {}

    async getOneUser(params: IGetOneUser): Promise<UsersDocument> {
        return await this.usersModel.findOne({ username: params.username, status: 1 });
    }

    async createUser(params: ICreateUser): Promise<UsersDocument> {
        return await new this.usersModel(params).save();
    }

    async createUserSeed(): Promise<UsersDocument> {
        let getUser = await this.getOneUser({ username: 'rendy' });
        if (!getUser) {
            return await new this.usersModel({
                username: 'rendy',
                password: await this.helperService.validateHash('F3rd1@nsy@h'),
                role: 'admin',
            }).save();
        }
    }

    async updateUserLogin(params: IUpdateUserLogin): Promise<UpdateWriteOpResult> {
        return await this.usersModel.updateOne(
            { _id: params.id },
            { $set: { hashToken: params.hashToken, isLogin: 1, lastLoginAt: this.helperService.validateTime(new Date(), 'datetime') } },
        );
    }
}
