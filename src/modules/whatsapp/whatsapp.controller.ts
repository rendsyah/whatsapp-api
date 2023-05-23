// Import Modules
import { Body, Controller, Get, Header, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

// Import Pipe
import { whatsappBlastMessageSchema, whatsappSendMessageSchema } from './whatsapp.pipe';

// Import Commons
import { ApiGetServiceDocs, ApiPostServiceDocs } from '@commons/config/swagger/api-swagger.docs';
import { MultersOptions } from '@commons/config/multer/multer.config';

// Import Dto
import { WhatsappBlastMessageDto, WhatsappSendMessageDto } from './dto/whatsapp.dto';

// Import Service
import { WhatsappService } from './whatsapp.service';

@ApiTags('Whatsapp')
@Controller('whatsapp')
export class WhatsappController {
    constructor(private readonly whatsappService: WhatsappService) {}

    /**
     * Handle to download template controller
     * @controller
     * @param res @interface Response
     * @returns Promise<void>
     */
    @Get('download')
    @Header('Content-Type', 'application/csv')
    @Header('Content-Disposition', 'attachment; filename="template.csv"')
    @ApiGetServiceDocs('download template')
    async whatsappDownloadTemplateController(@Res() res: Response): Promise<void> {
        return await this.whatsappService.whatsappDownloadTemplate(res);
    }

    /**
     * Handle to send message controller
     * @controller
     * @param dto @interface WhatsappSendMessageDto
     * @returns Promise<string>
     */
    @Post('send')
    @ApiPostServiceDocs('send message', WhatsappSendMessageDto)
    async whatsappSendMessageController(@Body(whatsappSendMessageSchema) dto: WhatsappSendMessageDto): Promise<string> {
        return await this.whatsappService.whatsappSendMessage(dto);
    }

    /**
     * Handle to blast message controller
     * @controller
     * @param dto @interface WhatsappBlastMessageDto
     * @param file @interface Express.Multer.File
     * @returns Promise<string>
     */
    @Post('send/blast')
    @ApiConsumes('multipart/form-data')
    @ApiPostServiceDocs('send blast message', WhatsappBlastMessageDto)
    @UseInterceptors(FileInterceptor('file', MultersOptions('upload')))
    async whatsappBlastMessageController(
        @Body(whatsappBlastMessageSchema) dto: WhatsappBlastMessageDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<string> {
        return await this.whatsappService.whatsappBlastMessage({ ...dto, file });
    }
}
