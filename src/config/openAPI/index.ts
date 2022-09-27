import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJson from "./swagger.json";

export const swaggerRouter = express.Router();

swaggerRouter.use("/api-docs", swaggerUi.serve);
swaggerRouter.get("/api-docs", swaggerUi.setup(swaggerJson));
