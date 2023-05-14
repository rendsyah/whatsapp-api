// Import Modules
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Import Base Repository
import { BaseRepository } from './base.repository';

// Import Entity
import { Access } from '../models/access.entity';

@Injectable()
export class AccessRepository extends BaseRepository<Access> {
    constructor(@InjectRepository(Access) private readonly accessModels: Repository<Access>) {
        super(accessModels);
    }
}
