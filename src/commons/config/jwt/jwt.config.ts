// Import Modules
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

// Define JWT Options
export class JwtConfig implements JwtOptionsFactory {
    createJwtOptions(): JwtModuleOptions {
        return {};
    }
}

// Define JWT Config
export const JwtConfigAsync: JwtModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (): Promise<JwtModuleOptions> => {
        return new JwtConfig().createJwtOptions();
    },
};
