// Import All Repository
import { IncomingRepository, OutgoingRepository, UsersRepository } from './repository';

// Define All Mongo DB Providers
export const MongoDbProviders = [IncomingRepository, OutgoingRepository, UsersRepository];
