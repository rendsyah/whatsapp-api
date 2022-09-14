// Modules
import { Document, Schema, model } from "mongoose";

// Interface
interface IChannels extends Document {
    name: string;
    status: number;
}

// Channel Schema
const channelsSchema = new Schema<IChannels>(
    {
        name: {
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

export default model<IChannels>("Channels", channelsSchema);
