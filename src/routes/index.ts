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
router.get("/", whatsappController);
router.post("/message", whatsappValidation(whatsappMessageSchema), whatsappMessageController);

// Whatsapp Template Routes
router.post("/template/create", whatsappValidation(whatsappCreateTemplateSchema), whatsappCreateTemplateController);
router.get("/template", whatsappValidation(whatsappGetTemplateSchema), whatsappGetTemplateController);
router.get("/template", whatsappValidation(whatsappGetAllTemplateSchema), whatsappGetAllTemplateController);
router.patch("/template/update", whatsappValidation(whatsappUpdateTemplateSchema), whatsappUpdateTemplateController);
router.delete("/template/delete", whatsappValidation(whatsappDeleteTemplateSchema), whatsappDeleteTemplateController);
router.get("/template/download", whatsappValidation(whatsappDownloadTemplateSchema), whatsappDownloadTemplateController);
