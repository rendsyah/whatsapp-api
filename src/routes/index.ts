// Modules
import express from "express";

// Middlewares
import { whatsappUpload, whatsappValidation } from "../middlewares";
import { whatsappMessageSchema } from "../modules/whatsapp/whatsapp.pipe";
import {
    whatsappTemplateCreateSchema,
    whatsappTemplateDeleteSchema,
    whatsappTemplateDownloadSchema,
    whatsappTemplateGetAllSchema,
    whatsappTemplateGetSchema,
    whatsappTemplateUpdateSchema,
} from "../modules/whatsappTemplate/template.pipe";

// Controllers
import { whatsappController, whatsappMessageController } from "../modules/whatsapp/whatsapp.controller";
import {
    whatsappCreateTemplateController,
    whatsappDeleteTemplateController,
    whatsappDownloadTemplateController,
    whatsappGetAllTemplateController,
    whatsappGetTemplateController,
    whatsappTemplateUpdateController,
} from "../modules/whatsappTemplate/template.controller";

// Routes
export const router = express.Router();

// Whatsapp Routes
router.get("/whatsapp", whatsappController);
router.post("/whatsapp/message", whatsappValidation(whatsappMessageSchema), whatsappMessageController);

// Whatsapp Template Routes
router.post("/whatsapp/template/create", whatsappValidation(whatsappTemplateCreateSchema), whatsappCreateTemplateController);
router.get("/whatsapp/template", whatsappValidation(whatsappTemplateGetSchema), whatsappGetTemplateController);
router.get("/whatsapp/template/all", whatsappValidation(whatsappTemplateGetAllSchema), whatsappGetAllTemplateController);
router.patch("/whatsapp/template", whatsappValidation(whatsappTemplateUpdateSchema), whatsappTemplateUpdateController);
router.delete("/whatsapp/template", whatsappValidation(whatsappTemplateDeleteSchema), whatsappDeleteTemplateController);
router.get("/whatsapp/template/download", whatsappValidation(whatsappTemplateDownloadSchema), whatsappDownloadTemplateController);
