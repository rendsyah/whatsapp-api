// Import Modules
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as appRoot from 'app-root-path';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: `${appRoot}/../public`,
            serveRoot: '/api/image',
        }),
    ],
})
export class StaticConfigModule {}
