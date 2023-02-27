// Import Modules
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Import Entity
import { ModelsBaseEntity } from './models_base.entity';

// Define Users Document
export type UsersDocument = HydratedDocument<Users>;

@Schema({ collection: 'users', timestamps: true })
export class Users extends ModelsBaseEntity {
    @Prop({ unique: true, isRequired: true })
    username: string;

    @Prop({ isRequired: true })
    password: string;

    @Prop({ isRequired: true })
    name: string;
}

// Define Users Schema
export const UsersSchema = SchemaFactory.createForClass(Users);
