// Import Modules
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// Import Commons
import { EnvironmentConfigModule } from '@commons/config/environment/environment.module';
import { MongooseConfigModule } from '@commons/config/databases/mongoose/mongoose.module';
import { RedisConfigModule } from '@commons/config/databases/redis/bull.module';
import { StaticConfigModule } from '@commons/config/static/static.module';
import { HelperConfigModule } from '@commons/lib/helper/helper.module';
import { ApiTimeoutInterceptor } from '@commons/interceptor/api-timeout.interceptor';
import { ApiTransformInterceptor } from '@commons/interceptor/api-transform.interceptor';
import { ApiExceptionsFilter } from '@commons/filter/api-exception-filter';

// Import All Service Modules
import { AuthModule } from '@modules/auth/auth.module';

// Import Service
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [EnvironmentConfigModule, MongooseConfigModule, RedisConfigModule, StaticConfigModule, HelperConfigModule, AuthModule],
    controllers: [AppController],
    providers: [
        { provide: APP_INTERCEPTOR, useClass: ApiTimeoutInterceptor },
        { provide: APP_INTERCEPTOR, useClass: ApiTransformInterceptor },
        { provide: APP_FILTER, useClass: ApiExceptionsFilter },
        AppService,
    ],
})
export class AppModule {}
