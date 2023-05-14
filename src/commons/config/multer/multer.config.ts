// Import Modules
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as appRoot from 'app-root-path';
import * as fs from 'fs';

// Import Api Exceptions
import { ApiBadRequestException } from '@commons/exception/api-exception';

// Import Constants
import { SERVICE_UPLOAD_FILE_SIZE } from '@commons/constants';

// Import Helper
import { HelperService } from '@commons/lib/helper/helper.service';

// Define Multers Options
export const MultersOptions = (destination: string): MulterOptions => {
    const configService = new ConfigService();
    const helperService = new HelperService(configService);

    const generatePath = `${appRoot}/..${process.env.SERVICE_UPLOAD_PATH}/${destination}`;
    const generateTime = helperService.validateTime(new Date(), 'date-time-2');
    const generateChar = helperService.validateRandomChar(10, 'alphanumeric');

    if (!fs.existsSync(generatePath)) {
        fs.mkdirSync(generatePath, { recursive: true });
    }

    return {
        storage: diskStorage({
            destination(req, file, cb) {
                cb(null, generatePath);
            },
            filename(req, file, cb) {
                const fileSplit = file.originalname.split('.');
                const fileExt = fileSplit[fileSplit.length - 1];
                const filename = `${generateTime}_${generateChar}.${fileExt}`;
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!(file.fieldname === 'image' && file.originalname.match(/\.(jpe?g|png)$/i))) {
                return cb(new ApiBadRequestException([file.fieldname], 'image not allowed!'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: SERVICE_UPLOAD_FILE_SIZE,
        },
    };
};
