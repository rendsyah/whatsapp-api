// Import Modules
import { Document, FilterQuery, Model, UpdateQuery, UpdateWriteOpResult } from 'mongoose';

// Define Base Repository
export abstract class BaseRepository<T> {
    constructor(protected readonly entityModels: Model<T>) {}

    async find(entityFilterQuery?: FilterQuery<T>): Promise<T[] | null> {
        return this.entityModels.find(entityFilterQuery);
    }

    async findOne(entityFilterQuery: FilterQuery<T>, projection?: Record<string, unknown>): Promise<T | null> {
        return this.entityModels.findOne(entityFilterQuery, { ...projection });
    }

    async create(entityCreateQuery: unknown): Promise<T | Document> {
        return new this.entityModels(entityCreateQuery).save();
    }

    async update(entityFilterQuery: FilterQuery<T>, entityUpdateQuery: UpdateQuery<T>): Promise<UpdateWriteOpResult> {
        return this.entityModels.updateOne(entityFilterQuery, entityUpdateQuery);
    }

    async delete(entityFilterQuery: FilterQuery<T>): Promise<unknown> {
        return this.entityModels.deleteOne(entityFilterQuery);
    }
}
