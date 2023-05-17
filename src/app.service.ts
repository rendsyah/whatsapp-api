// Import Modules
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    /**
     * Handle to get welcome message
     * @publicApi
     * @returns Promise<string>
     */
    async getWelcome(): Promise<string> {
        return 'Welcome to Whatsapp API';
    }
}
