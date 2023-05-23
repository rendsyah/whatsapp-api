// Import All Repository
import { IncomingRepository, OutgoingRepository, TemplateRepository, UsersRepository } from './repository';

// Define All Mongo DB Providers
export const MongoDbProviders = [IncomingRepository, OutgoingRepository, TemplateRepository, UsersRepository];
