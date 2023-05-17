// Import Modules
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Import Base Repository
import { BaseRepository } from './base.repository';

// Import Entity
import { Outgoing, OutgoingDocument } from '../models/outgoing.entity';

@Injectable()
export class OutgoingRepository extends BaseRepository<OutgoingDocument> {
    constructor(@InjectModel(Outgoing.name) private readonly outgoingModels: Model<OutgoingDocument>) {
        super(outgoingModels);
    }
}
