// Modules
import { Document, Schema, model, Types } from "mongoose";

// Interface
interface ITemplates extends Document {
    namespace: string;
    message: string;
    status: number;
    channelId: [
        {
            type: string;
            ref: string;
        },
    ];
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
        status: {
            type: Number,
            default: 1,
        },
        channelId: [
            {
                type: Types.ObjectId,
                ref: "Channels",
            },
        ],
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

export default model<ITemplates>("Templates", templatesSchema);
