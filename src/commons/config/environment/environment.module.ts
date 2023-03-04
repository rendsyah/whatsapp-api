// Import Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Import Environment Config
import { environmentSchema } from './environment.pipe';
import config from './config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            validationSchema: environmentSchema,
            load: config,
        }),
    ],
})
export class EnvironmentConfigModule {}
