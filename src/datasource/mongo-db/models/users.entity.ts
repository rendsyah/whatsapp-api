// Import Modules
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Define Users Document
export type UsersDocument = HydratedDocument<Users>;

@Schema({ collection: 'users', timestamps: true })
export class Users {
    @Prop({ isRequired: true })
    name: string;

    @Prop({ unique: true, isRequired: true })
    phone: string;

    @Prop({ default: 0 })
    expired: number;

    @Prop({ default: 1 })
    status: number;

    @Prop({ default: 0 })
    isValidation: number;

    @Prop({ default: 0 })
    isDeleted: number;

    @Prop({ default: null })
    deletedAt: string;
}

// Define Users Schema
export const UsersSchema = SchemaFactory.createForClass(Users);
