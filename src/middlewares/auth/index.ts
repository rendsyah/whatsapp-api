import { LocalAuth } from "whatsapp-web.js";
import { path } from "app-root-path";

export const whatsappAuth = (sessionClient: string, sessionPath: string) => {
    return new LocalAuth({
        clientId: sessionClient,
        dataPath: `${path}${sessionPath}`,
    });
};
