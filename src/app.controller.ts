// Modules
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Service
import { AppService } from './app.service';

@ApiTags('Welcome')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('welcome')
    getWelcome(): string {
        return this.appService.getWelcome();
    }
}
