// Import Modules
import { DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, InsertResult, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

// Define Base Repository
export abstract class BaseRepository<T> {
    constructor(protected readonly entityModels: Repository<T>) {}

    async find(entityFilterQuery?: FindManyOptions<T>): Promise<T[] | null> {
        return this.entityModels.find(entityFilterQuery);
    }

    async findOne(entityFilterQuery: FindOneOptions<T>): Promise<T | null> {
        return this.entityModels.findOne(entityFilterQuery);
    }

    async create(entityCreateQuery: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[]): Promise<InsertResult> {
        return this.entityModels.insert(entityCreateQuery);
    }

    async update(entityFilterQuery: FindOptionsWhere<T>, entityUpdateQuery: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
        return this.entityModels.update(entityFilterQuery, entityUpdateQuery);
    }

    async delete(entityFilterQuery: FindOptionsWhere<T>): Promise<DeleteResult> {
        return this.entityModels.delete(entityFilterQuery);
    }
}
