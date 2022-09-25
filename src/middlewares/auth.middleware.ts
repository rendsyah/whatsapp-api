// Modules
import { LocalAuth } from "whatsapp-web.js";
import appRootPath from "app-root-path";

// Auth Middleware
export const whatsappAuth = (sessionClient: string, sessionPath: string) => {
    return new LocalAuth({
        clientId: sessionClient,
        dataPath: `${appRootPath}${sessionPath}`,
    });
};
