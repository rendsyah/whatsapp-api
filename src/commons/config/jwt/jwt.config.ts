// Import Modules
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

export class JwtConfig implements JwtOptionsFactory {
    createJwtOptions(): JwtModuleOptions {
        return {};
    }
}

export const jwtConfigAsync: JwtModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (): Promise<JwtModuleOptions> => {
        return new JwtConfig().createJwtOptions();
    },
};
