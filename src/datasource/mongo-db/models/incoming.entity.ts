// Import Modules
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Define Incoming Document
export type IncomingDocument = HydratedDocument<Incoming>;

@Schema({ collection: 'incoming', timestamps: true })
export class Incoming {
    @Prop({ isRequired: true })
    mediaId: number;

    @Prop({ isRequired: true })
    from: string;

    @Prop({ isRequired: true })
    to: string;

    @Prop({ isRequired: true })
    message: string;

    @Prop({ default: '' })
    attachment: string;

    @Prop({ isRequired: true })
    rcvdTime: string;

    @Prop({ default: null })
    platform: string;

    @Prop({ default: '' })
    status: string;

    @Prop({ default: 0 })
    isAck: number;

    @Prop({ default: 0 })
    isDeleted: number;

    @Prop({ default: null })
    deletedAt: string;
}

// Define Incoming Schema
export const IncomingSchema = SchemaFactory.createForClass(Incoming);
