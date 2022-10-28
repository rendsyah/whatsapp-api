// Modules
import { Document, Schema, model } from "mongoose";

// Interface
interface IOutgoingLog extends Document {
    from: string;
    to: string;
    message: string;
    media: string;
    sentTime: string;
    type: string;
    status: string;
    _status: number;
}

// Channel Schema
const OutgoingLogSchema = new Schema<IOutgoingLog>(
    {
        from: {
            type: String,
            required: true,
        },
        to: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            default: "",
        },
        media: {
            type: String,
            default: "",
        },
        sentTime: {
            type: String,
        },
        type: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "",
        },
        _status: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

export default model<IOutgoingLog>("OutgoingLogs", OutgoingLogSchema, "outgoingLogs");
