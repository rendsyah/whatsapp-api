// Import Modules
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModuleAsyncOptions, MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express/multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as appRoot from 'app-root-path';

// Import Api Exceptions
import { ApiBadRequestException } from '@commons/exception/api-exception';

// Import Constants
import { SERVICE_UPLOAD_FILE_SIZE } from '@commons/constants';

// Import Helper
import { HelperConfigModule } from '@commons/lib/helper/helper.module';
import { HelperService } from '@commons/lib/helper/helper.service';

// Define Multer Options
export class MulterConfig implements MulterOptionsFactory {
    constructor(private readonly configService: ConfigService, private helperService: HelperService) {}

    createMulterOptions(): MulterOptions | Promise<MulterOptions> {
        const destination = this.configService.get('app.SERVICE_UPLOAD_PATH');
        const generateTime = this.helperService.validateTime(new Date(), 'dateformat');
        const generateChar = this.helperService.validateRandomChar(10, 'alphanumeric');

        return {
            storage: diskStorage({
                destination(req, file, cb) {
                    cb(null, `${appRoot}/..${destination}`);
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
    }
}

// Define Multer Config
export const multerConfigAsync: MulterModuleAsyncOptions = {
    imports: [ConfigModule, HelperConfigModule],
    inject: [ConfigService, HelperService],
    useFactory: async (configService: ConfigService, helperService: HelperService): Promise<MulterModuleOptions> => {
        return new MulterConfig(configService, helperService).createMulterOptions();
    },
};
