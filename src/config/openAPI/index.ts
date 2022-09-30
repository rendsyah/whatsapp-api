import express from "express";
import swaggerUi from "swagger-ui-express";
import whatsappJson from "./whatsapp.json";

export const swaggerRouter = express.Router();

swaggerRouter.use("/api/docs", swaggerUi.serve);
swaggerRouter.get("/api/docs", swaggerUi.setup(whatsappJson));
