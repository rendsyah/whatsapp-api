// Modules
import express from "express";

// Middlewares
import { whatsappUpload, whatsappValidation } from "../middlewares";
import { whatsappMessageSchema } from "../modules/whatsapp/whatsapp.pipe";
import {
    whatsappCreateTemplateSchema,
    whatsappDeleteTemplateSchema,
    whatsappDownloadTemplateSchema,
    whatsappGetAllTemplateSchema,
    whatsappGetTemplateSchema,
    whatsappUpdateTemplateSchema,
} from "../modules/whatsappTemplate/whatsappTemplate.pipe";

// Controllers
import { whatsappController, whatsappMessageController } from "../modules/whatsapp/whatsapp.controller";
import {
    whatsappCreateTemplateController,
    whatsappDeleteTemplateController,
    whatsappDownloadTemplateController,
    whatsappGetAllTemplateController,
    whatsappGetTemplateController,
    whatsappUpdateTemplateController,
} from "../modules/whatsappTemplate/whatsappTemplate.controller";

// Routes
export const router = express.Router();

// Whatsapp Routes
router.get("/whatsapp", whatsappController);
router.post("/whatsapp/message", whatsappValidation(whatsappMessageSchema), whatsappMessageController);

// Whatsapp Template Routes
router.post("/whatsapp/template/create", whatsappValidation(whatsappCreateTemplateSchema), whatsappCreateTemplateController);
router.get("/whatsapp/template", whatsappValidation(whatsappGetTemplateSchema), whatsappGetTemplateController);
router.get("/whatsapp/template/all", whatsappValidation(whatsappGetAllTemplateSchema), whatsappGetAllTemplateController);
router.patch("/whatsapp/template/update", whatsappValidation(whatsappUpdateTemplateSchema), whatsappUpdateTemplateController);
router.delete("/whatsapp/template/delete", whatsappValidation(whatsappDeleteTemplateSchema), whatsappDeleteTemplateController);
router.get("/whatsapp/template/download", whatsappValidation(whatsappDownloadTemplateSchema), whatsappDownloadTemplateController);
