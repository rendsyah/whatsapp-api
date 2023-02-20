// Import Modules
import { Global, Module } from '@nestjs/common';

// Import Helper Service
import { HelperService } from './helper.service';

@Global()
@Module({
    providers: [HelperService],
    exports: [HelperService],
})
export class HelperConfigModule {}
