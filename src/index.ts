import express, { Request, Response, NextFunction } from "express";
import { Client, MessageMedia } from "whatsapp-web.js";
import dotenv from "dotenv";
import cors from "cors";
import qrcode from "qrcode-terminal";
import fs from "fs";

dotenv.config();

import { authWA } from "./services/auth/authWA";
import { broadcastMessageService } from "./services/whatsapp/send/broadcastMessageService";
import { replaceMessage, replaceHp } from "./lib/baseFunctions";

const app = express();

// CONFIG ENVIRONMENT
const PROGRAM_PORT = process.env.PROGRAM_PORT;
const PROGRAM_NAME = process.env.PROGRAM_NAME;

// SESSION
const SESSION_CLIENT = process.env.SESSION_CLIENT ?? "";
const SESSION_FILE_PATH = process.env.SESSION_FILE_PATH ?? "";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// WHATSAPP CLIENT
const client = new Client({
    puppeteer: {
        headless: true,
        args: ["--no-sandbox"],
    },
    takeoverOnConflict: true,
    takeoverTimeoutMs: 1000,
    qrMaxRetries: 30000,
    authStrategy: authWA(SESSION_CLIENT, SESSION_FILE_PATH),
});

if (fs.existsSync(SESSION_FILE_PATH)) {
    fs.rmSync(SESSION_FILE_PATH, { recursive: true, force: true });
    console.log("Whatsapp restoring session...");
}

client.on("qr", (qr) => {
    console.log("Whatsapp QR Code received");
    qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
    const whatsappVersion = await client.getWWebVersion();
    console.log("Whatsapp is connected!");
    console.log(`Whatsapp version ${whatsappVersion}`);
});

client.on("authenticated", () => {
    console.log("Whatsapp authentication success!");
});

client.on("auth_failure", (message) => {
    console.log("Whatsapp authentication failed!, restarting...");
});

client.on("message", (message) => {});

client.on("change_state", (state) => {
    console.log("Whatsapp state", state);
});

client.on("disconnected", (reason) => {
    console.log("Whatsapp is disconnected!", reason);
    client.destroy();
});

client.initialize();

// API
app.get("/whatsapp/send", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dataBroadcastMessage = await broadcastMessageService();
        const { dataNasabah, message } = dataBroadcastMessage;

        if (dataNasabah.length < 1 && !message) {
            return res.status(400).send({ message: "bad request!" });
        }

        for (let i = 0; i < dataNasabah.length; i++) {
            const changeMessage = replaceMessage(message, dataNasabah[i].name);
            const changeHp = replaceHp(dataNasabah[i].hp);
            const media = MessageMedia.fromFilePath("./images/gsk.jpeg");

            await client.sendMessage(changeHp, changeMessage, { media });
        }

        return res.status(201).send({
            message: "success",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// MIDDLEWARE RESPONSE ERROR
app.use((err: any, req: Request, res: Response, next: NextFunction) => res.status(500).send({ message: "internal server error!" }));

// LISTENING API
app.listen(PROGRAM_PORT, () => console.log(`${PROGRAM_NAME} is connected!`));
