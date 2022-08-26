import express from "express";

import { whatsappUpload, whatsappValidation } from "../middlewares";
import { whatsappMessageSchema } from "../whatsapp/whatsapp.pipe";
import { whatsappBroadcastController, whatsappMessageController } from "../whatsapp/whatsapp.controller";

export const router = express.Router();

router.post("/whatsapp/broadcast", whatsappUpload("file"), whatsappBroadcastController);
router.post("/whatsapp/message", whatsappValidation(whatsappMessageSchema), whatsappMessageController);
