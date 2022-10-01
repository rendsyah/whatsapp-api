// Modules
import express from "express";

// Middlewares
import { whatsappUpload, whatsappValidation } from "../middlewares";
import { whatsappMessageSchema } from "../modules/whatsapp/whatsapp.pipe";

// Controllers
import { whatsappController, whatsappMessageController } from "../modules/whatsapp/whatsapp.controller";

// Routes
export const router = express.Router();

// Whatsapp Routes
router.get("/", whatsappController);
router.post("/message", whatsappValidation(whatsappMessageSchema), whatsappMessageController);
