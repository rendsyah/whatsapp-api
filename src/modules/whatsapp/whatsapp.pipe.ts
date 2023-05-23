// Import Modules
import { Injectable } from '@nestjs/common';
import * as Joi from 'joi';

// Import Commons
import { ApiValidationPipe } from '@commons/pipe/api-validation';

// Import Dto
import { WhatsappBlastMessageDto, WhatsappSendMessageDto } from './dto/whatsapp.dto';

@Injectable()
export class whatsappSendMessageSchema extends ApiValidationPipe {
    constructor() {
        super();
    }

    public buildSchema(): Joi.Schema {
        return Joi.object<WhatsappSendMessageDto>({
            sender: Joi.string().strict(true).regex(new RegExp(/^\d+$/)).min(5).required(),
            message: Joi.string().required(),
        });
    }
}

@Injectable()
export class whatsappBlastMessageSchema extends ApiValidationPipe {
    constructor() {
        super();
    }

    public buildSchema(): Joi.Schema {
        return Joi.object<WhatsappBlastMessageDto>({
            template: Joi.string().required(),
        });
    }
}
