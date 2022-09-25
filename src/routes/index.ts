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
    whatsappTemplateCreateController,
    whatsappTemplateDeleteController,
    whatsappTemplateDownloadController,
    whatsappTemplateGetAllController,
    whatsappTemplateGetController,
    whatsappTemplateUpdateController,
} from "../modules/whatsappTemplate/template.controller";

// Routes
export const router = express.Router();

// Whatsapp Routes
router.get("/whatsapp", whatsappController);
router.post("/whatsapp/message", whatsappValidation(whatsappMessageSchema), whatsappMessageController);

// Whatsapp Template Routes
router.post("/whatsapp/template/create", whatsappValidation(whatsappTemplateCreateSchema), whatsappTemplateCreateController);
router.get("/whatsapp/template/:id", whatsappValidation(whatsappTemplateGetSchema), whatsappTemplateGetController);
router.get("/whatsapp/template/all", whatsappValidation(whatsappTemplateGetAllSchema), whatsappTemplateGetAllController);
router.patch("/whatsapp/template/:id", whatsappValidation(whatsappTemplateUpdateSchema), whatsappTemplateUpdateController);
router.delete("/whatsapp/template/:id", whatsappValidation(whatsappTemplateDeleteSchema), whatsappTemplateDeleteController);
router.get("/whatsapp/template/download", whatsappValidation(whatsappTemplateDownloadSchema), whatsappTemplateDownloadController);
