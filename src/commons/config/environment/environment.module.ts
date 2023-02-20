// Import Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Import Environment Config
import { environmentConfigSchema } from './environment.config';
import config from './config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            validationSchema: environmentConfigSchema,
            load: config,
        }),
    ],
})
export class EnvironmentConfigModule {}
