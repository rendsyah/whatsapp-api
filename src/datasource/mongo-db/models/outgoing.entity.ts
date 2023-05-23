// Import Modules
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Define Outgoing Document
export type OutgoingDocument = HydratedDocument<Outgoing>;

@Schema({ collection: 'outgoing', timestamps: true })
export class Outgoing {
    @Prop({ isRequired: true })
    from: string;

    @Prop({ isRequired: true })
    to: string;

    @Prop({ isRequired: true })
    message: string;

    @Prop({ default: '' })
    attachment: string;

    @Prop({ isRequired: true })
    sentTime: string;

    @Prop({ default: '' })
    status: string;

    @Prop({ default: 0 })
    isAck: number;

    @Prop({ default: 0 })
    isDeleted: number;

    @Prop({ default: null })
    deletedAt: string;
}

// Define Outgoing Schema
export const OutgoingSchema = SchemaFactory.createForClass(Outgoing);
