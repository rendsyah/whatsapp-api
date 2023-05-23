// Import All Repository
import { IncomingRepository, OutgoingRepository, TemplateRepository, UsersRepository } from '@datasource/mongo-db/repository';

// Define Mongo DB Models Interfaces
export interface IMongoDbModels {
    IncomingModels: IncomingRepository;
    OutgoingModels: OutgoingRepository;
    TemplateModels: TemplateRepository;
    UsersModels: UsersRepository;
}
