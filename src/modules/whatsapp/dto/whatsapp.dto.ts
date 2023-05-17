// Import Modules
import { ApiProperty } from '@nestjs/swagger';

// Define Whatsapp Send Message Dto
export class WhatsappSendMessageDto {
    @ApiProperty({ default: '6281318481635' })
    sender: string;

    @ApiProperty({ default: 'hallo' })
    message: string;
}
