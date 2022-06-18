import express, { Request, Response, NextFunction } from "express";
import { Client, MessageMedia } from "whatsapp-web.js";
import dotenv from "dotenv";
import cors from "cors";
import qrcode from "qrcode-terminal";
import fs from "fs";

dotenv.config();

// SERVICES
import { authWA } from "./services/auth/authWA";
import { broadcastMessageService } from "./services/whatsapp/send/broadcastMessageService";
import { validationService } from "./services/whatsapp/send/validationService";

// LIBARY
import { replaceMessage, replaceHp } from "./lib/baseFunctions";

const app = express();

// CONFIG ENVIRONMENT
const PROGRAM_PORT = process.env.PROGRAM_PORT;
const PROGRAM_NAME = process.env.PROGRAM_NAME;

// CONFIG SESSION
const SESSION_CLIENT = process.env.SESSION_CLIENT ?? "";
const SESSION_FILE_PATH = process.env.SESSION_FILE_PATH ?? "";

// CONFIG API
const API_VALIDATION = process.env.API_VALIDATION ?? "";
const API_CHATBOT = process.env.API_CHATBOT ?? "";

const IS_ACTIVE = process.env.IS_ACTIVE;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// WHATSAPP CLIENT
const client = new Client({
    puppeteer: {
        headless: true,
    },
    takeoverTimeoutMs: 30000,
    qrMaxRetries: 10000,
    authStrategy: authWA(SESSION_CLIENT, SESSION_FILE_PATH),
});

// WHATSAPP RESTORING AUTH SESSION
if (fs.existsSync(SESSION_FILE_PATH)) {
    fs.rmSync(SESSION_FILE_PATH, { recursive: true, force: true });
    console.log("Whatsapp restoring session...");
}

// WHATSAPP GENERATE QR CODE
client.on("qr", (qr) => {
    console.log("Whatsapp QR Code received");
    qrcode.generate(qr, { small: true });
});

// WHATSAPP CONNECT
client.on("ready", async () => {
    const whatsappVersion = await client.getWWebVersion();
    console.log("Whatsapp is connected!");
    console.log(`Whatsapp version ${whatsappVersion}`);
});

// WHATSAPP AUTH SESSION
client.on("authenticated", () => {
    console.log("Whatsapp authentication success!");
});

// WHATSAPP GET MESSAGE
client.on("message", async (message) => {
    // STORE REQUEST DATA
    const dataMessage = await message.getContact();
    const dataSender = "";
    const dataMedia = "";
    const dataReceived = "";

    console.log({
        message: await message.getContact(),
    });

    switch (IS_ACTIVE) {
        case "1":
            // REQUEST DATA VALIDATION
            const requestValidation = {
                message: dataMessage,
                sender: dataSender,
                media: dataMedia,
                received: dataReceived,

                // API VALIDATION URL
                url: API_VALIDATION,
            };

            await validationService(requestValidation);

        case "2":
            // REQUEST DATA CHATBOT
            const requestChatBot = {
                // API CHATBOT URL
                url: API_CHATBOT,
            };
    }
});

// WHATSAPP CONNECTION
client.on("change_state", (state) => {
    console.log("Whatsapp connection", state);
});

// WHATSAPP DISCONNECT
client.on("disconnected", (reason) => {
    console.log("Whatsapp is disconnected!", reason);
    client.destroy();
});

// WHATSAPP INITALIZE
client.initialize();

// API GET
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
        next(error);
    }
});

// API POST
app.post("");

// MIDDLEWARE RESPONSE ERROR
app.use((err: any, req: Request, res: Response, next: NextFunction) => res.status(500).send({ message: "internal server error!" }));

// LISTENING API
app.listen(PROGRAM_PORT, () => console.log(`${PROGRAM_NAME} is connected!`));
