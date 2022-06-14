import { LocalAuth } from "whatsapp-web.js";

export const authWA = (sessionClient: string, sessionPath?: string) => {
    return new LocalAuth({
        clientId: sessionClient,
        dataPath: sessionPath,
    });
};
