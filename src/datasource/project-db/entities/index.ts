// Import All Entity
import { UsersSchema } from './users.entity';

export const DbEntities = [
    {
        name: 'Users',
        useFactory: () => UsersSchema,
    },
];
