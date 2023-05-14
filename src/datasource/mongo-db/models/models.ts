// Import All Entities Schema
import { UsersSchema } from './users.entity';

// Define All Mongo Entities
export const LogsDbEntitiesModels = [
    {
        name: 'Users',
        schema: UsersSchema,
    },
];
