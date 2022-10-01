// Modules
import { Document, Schema, model } from "mongoose";

// Interface
interface IOutgoingLog extends Document {
    from: string;
    to: string;
    message: string;
    link: string;
    sentTime: string;
    type: string;
    _status: number;
    status: string;
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
        link: {
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
        _status: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    },
);

export default model<IOutgoingLog>("OutgoingLogs", OutgoingLogSchema, "outgoingLogs");
