// Import Modules
import { SetMetadata } from '@nestjs/common';

// Import Interfaces
import { IRole } from './interfaces';

// Define Roles Decorator
export const ROLES_KEY = 'roles';
export const Roles = (...roles: IRole[]) => SetMetadata(ROLES_KEY, roles);
