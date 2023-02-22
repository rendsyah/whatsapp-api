// Import Modules
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema({ collection: 'users', timestamps: true })
export class Users {
    @Prop({ unique: true, isRequired: true })
    username: string;

    @Prop({ isRequired: true })
    password: string;

    @Prop({ default: '' })
    hashToken: string;

    @Prop({ isRequired: true })
    role: string;

    @Prop({ default: 1 })
    status: number;

    @Prop({ default: 0 })
    isDeleted: number;

    @Prop({ default: null })
    deletedAt: string;
}

// Define Users Schema
export const UsersSchema = SchemaFactory.createForClass(Users);
