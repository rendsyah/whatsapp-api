// Import All Entities Schema
import { IncomingSchema } from './incoming.entity';
import { OutgoingSchema } from './outgoing.entity';
import { TemplateSchema } from './template.entity';
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
        name: 'Template',
        schema: TemplateSchema,
    },
    {
        name: 'Users',
        schema: UsersSchema,
    },
];
