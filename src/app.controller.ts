// Import Modules
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Import Service
import { AppService } from './app.service';

@ApiTags('Welcome')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    /**
     * Handle to get welcome message controller
     * @controller
     * @returns Promise<string>
     */
    @Get('welcome')
    async getWelcomeController(): Promise<string> {
        return await this.appService.getWelcome();
    }
}
