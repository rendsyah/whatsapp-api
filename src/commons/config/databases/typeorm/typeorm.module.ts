// Import Modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import Typeorm Config
import { typeOrmConfigAsync } from './typeorm.config';

@Module({
    imports: [TypeOrmModule.forRootAsync(typeOrmConfigAsync)],
})
export class TypeOrmConfigModule {}
