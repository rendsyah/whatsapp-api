// Modules
import express from "express";

// Middlewares
import { whatsappUpload, whatsappValidation } from "../middlewares";
import {
    whatsappTemplateCreateSchema,
    whatsappTemplateDeleteSchema,
    whatsappTemplateDownloadSchema,
    whatsappTemplateGetAllSchema,
    whatsappTemplateGetSchema,
    whatsappTemplateSchema,
    whatsappTemplateUpdateSchema,
} from "../whatsapp/schemas/template.pipe";
import { whatsappMessageSchema } from "../whatsapp/schemas/message.pipe";

// Controllers
import { whatsappController } from "../whatsapp/whatsapp.controller";
import {
    whatsappTemplateController,
    whatsappTemplateCreateController,
    whatsappTemplateDeleteController,
    whatsappTemplateDownloadController,
    whatsappTemplateGetAllController,
    whatsappTemplateGetController,
    whatsappTemplateUpdateController,
} from "../whatsapp/controllers/template.controller";
import { whatsappMessageController } from "../whatsapp/controllers/message.controller";

// Routes
export const router = express.Router();

// Whatsapp Routes
router.get("/whatsapp", whatsappController);

// Template Routes
router.post("/whatsapp/template", whatsappUpload("file"), whatsappValidation(whatsappTemplateSchema), whatsappTemplateController);
router.post("/whatsapp/template/create", whatsappValidation(whatsappTemplateCreateSchema), whatsappTemplateCreateController);
router.get("/whatsapp/template", whatsappValidation(whatsappTemplateGetSchema), whatsappTemplateGetController);
router.get("/whatsapp/template/all", whatsappValidation(whatsappTemplateGetAllSchema), whatsappTemplateGetAllController);
router.patch("/whatsapp/template/update", whatsappValidation(whatsappTemplateUpdateSchema), whatsappTemplateUpdateController);
router.delete("/whatsapp/template/delete", whatsappValidation(whatsappTemplateDeleteSchema), whatsappTemplateDeleteController);
router.get("/whatsapp/template/download", whatsappValidation(whatsappTemplateDownloadSchema), whatsappTemplateDownloadController);

// Message Routes
router.post("/whatsapp/message", whatsappValidation(whatsappMessageSchema), whatsappMessageController);
