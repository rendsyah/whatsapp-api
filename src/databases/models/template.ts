// Modules
import { Document, Schema, model } from "mongoose";

// Interface
interface ITemplates extends Document {
    namespace: string;
    message: string;
    service: string;
    status: number;
}

// Template Schema
const templatesSchema = new Schema<ITemplates>(
    {
        namespace: {
            type: String,
            default: null,
            unique: true,
        },
        message: {
            type: String,
            default: "",
        },
        service: {
            type: String,
            required: true,
        },
        status: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

export default model<ITemplates>("templates", templatesSchema);
