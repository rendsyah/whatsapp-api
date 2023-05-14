// Import All Repository
import { UsersRepository } from '@datasource/mongo-db/repository';

// Define Mongo DB Models Interfaces
export interface IMongoDbModels {
    UsersModels: UsersRepository;
}
