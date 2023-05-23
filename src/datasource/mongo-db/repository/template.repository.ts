// Import Modules
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Import Base Repository
import { BaseRepository } from './base.repository';

// Import Entity
import { Template, TemplateDocument } from '../models/template.entity';

@Injectable()
export class TemplateRepository extends BaseRepository<TemplateDocument> {
    constructor(@InjectModel(Template.name) private readonly templateModels: Model<TemplateDocument>) {
        super(templateModels);
    }
}
