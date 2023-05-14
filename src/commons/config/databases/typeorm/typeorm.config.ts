// Import Modules
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

// Define Typeorm Options
export class TypeOrmConfig implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    public createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mariadb',
            host: this.configService.get<string>('db.SERVICE_DB_HOST'),
            port: +this.configService.get<string>('db.SERVICE_DB_PORT'),
            username: this.configService.get<string>('db.SERVICE_DB_USER'),
            password: this.configService.get<string>('db.SERVICE_DB_PASS'),
            database: this.configService.get<string>('db.SERVICE_DB_NAME'),
            synchronize: false, // for production set to false and use migration
            logging: false, // for production set to false
            connectTimeout: 60000,
            entities: [this.configService.get<string>('db.SERVICE_DB_ENTITIES')],
            migrations: [this.configService.get<string>('db.SERVICE_DB_MIGRATIONS')],
        };
    }
}

// Define Typeorm Config
export const TypeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        return new TypeOrmConfig(configService).createTypeOrmOptions();
    },
};
