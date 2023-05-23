// Import Modules
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Define Template Document
export type TemplateDocument = HydratedDocument<Template>;

@Schema({ collection: 'template', timestamps: true })
export class Template {
    @Prop({ unique: true, isRequired: true })
    name: string;

    @Prop({ isRequired: true })
    message: string;

    @Prop({ default: 1 })
    status: number;

    @Prop({ default: 0 })
    isDeleted: number;

    @Prop({ default: null })
    deletedAt: string;
}

// Define Template Schema
export const TemplateSchema = SchemaFactory.createForClass(Template);
