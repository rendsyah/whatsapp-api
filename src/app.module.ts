// Import Modules
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// Import Commons
import { ConfigurationConfigModule } from '@commons/config/configuration/configuration.module';
import { BullConfigModule } from '@commons/config/bull/bull.module';
import { MongooseConfigModule } from '@commons/config/databases/mongoose/mongoose.module';
import { LimiterConfigModule } from '@commons/config/limiter/limiter.module';
import { StaticConfigModule } from '@commons/config/static/static.module';
import { HelperConfigModule } from '@commons/lib/helper/helper.module';
import { ApiTimeoutInterceptor } from '@commons/interceptor/api-timeout.interceptor';
import { ApiTransformInterceptor } from '@commons/interceptor/api-transform.interceptor';
import { ApiExceptionsFilter } from '@commons/filter/api-exception-filter';

// Import All Service Modules
import { WhatsappModule } from '@modules/whatsapp/whatsapp.module';

// Import Service
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Define App Module
@Module({
    imports: [
        ConfigurationConfigModule,
        BullConfigModule,
        MongooseConfigModule,
        LimiterConfigModule,
        StaticConfigModule,
        HelperConfigModule,
        WhatsappModule,
    ],
    controllers: [AppController],
    providers: [
        { provide: APP_INTERCEPTOR, useClass: ApiTimeoutInterceptor },
        { provide: APP_INTERCEPTOR, useClass: ApiTransformInterceptor },
        { provide: APP_FILTER, useClass: ApiExceptionsFilter },
        AppService,
    ],
})

// Export App Module
export class AppModule {}
