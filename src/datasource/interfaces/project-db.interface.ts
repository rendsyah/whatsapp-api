// Import All Repository
import { AccessRepository, UsersRepository } from '@datasource/project-db/repository';

// Define Project DB Models Interfaces
export interface IProjectDbModels {
    AccessModels: AccessRepository;
    UsersModels: UsersRepository;
}
