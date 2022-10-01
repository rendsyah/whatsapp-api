// Modules
import { Document, Schema, model } from "mongoose";

// Interface
interface IIncomingLogs extends Document {
    from: string;
    to: string;
    message: string;
    receivedTime: string;
    type: string;
    device: string;
    status: string;
}

// Channel Schema
const incomingLogsSchema = new Schema<IIncomingLogs>(
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
        receivedTime: {
            type: String,
        },
        type: {
            type: String,
            required: true,
        },
        device: {
            type: String,
            default: "",
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

export default model<IIncomingLogs>("IncomingLogs", incomingLogsSchema, "incomingLogs");
