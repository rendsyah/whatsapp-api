// Import All Entities Schema
import { IncomingSchema } from './incoming.entity';
import { OutgoingSchema } from './outgoing.entity';
import { UsersSchema } from './users.entity';

// Define All Mongo Entities
export const LogsDbEntitiesModels = [
    {
        name: 'Incoming',
        schema: IncomingSchema,
    },
    {
        name: 'Outgoing',
        schema: OutgoingSchema,
    },
    {
        name: 'Users',
        schema: UsersSchema,
    },
];
