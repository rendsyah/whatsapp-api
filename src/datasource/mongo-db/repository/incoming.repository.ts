// Import Modules
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Import Base Repository
import { BaseRepository } from './base.repository';

// Import Entity
import { Incoming, IncomingDocument } from '../models/incoming.entity';

@Injectable()
export class IncomingRepository extends BaseRepository<IncomingDocument> {
    constructor(@InjectModel(Incoming.name) private readonly incomingModels: Model<IncomingDocument>) {
        super(incomingModels);
    }
}
