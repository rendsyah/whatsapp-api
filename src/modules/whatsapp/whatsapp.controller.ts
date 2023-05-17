// Import Modules
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Import Pipe
import { whatsappSendMessageSchema } from './whatsapp.pipe';

// Import Commons
import { ApiPostServiceDocs } from '@commons/config/swagger/api-swagger.docs';

// Import Dto
import { WhatsappSendMessageDto } from './dto/whatsapp.dto';

// Import Service
import { WhatsappService } from './whatsapp.service';

@ApiTags('Whatsapp')
@Controller('whatsapp')
export class WhatsappController {
    constructor(private readonly whatsappService: WhatsappService) {}

    @Post('send')
    @ApiPostServiceDocs('send message', WhatsappSendMessageDto)
    async whatsappSendMessageController(@Body(whatsappSendMessageSchema) dto: WhatsappSendMessageDto): Promise<string> {
        return await this.whatsappService.whatsappSendMessage(dto);
    }
}
