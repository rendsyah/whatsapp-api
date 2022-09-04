// Modules
import express from "express";

// Middlewares
import { whatsappUpload, whatsappValidation } from "../middlewares";
import { whatsappBroadcastSchema, whatsappMessageSchema } from "../whatsapp/whatsapp.pipe";

// Controllers
import { whatsappBroadcastController, whatsappMessageController } from "../whatsapp/whatsapp.controller";

// Routes
export const router = express.Router();

// Broadcast Routes
router.post("/whatsapp/broadcast", whatsappUpload("file"), whatsappValidation(whatsappBroadcastSchema), whatsappBroadcastController);

// Message Routes
router.post("/whatsapp/message", whatsappValidation(whatsappMessageSchema), whatsappMessageController);
