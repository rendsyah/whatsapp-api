// Import Modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import Typeorm Config
import { TypeOrmConfigAsync } from './typeorm.config';

// Define Typeorm Config Module
@Module({
    imports: [TypeOrmModule.forRootAsync(TypeOrmConfigAsync)],
})

// Export Typeorm Config Module
export class TypeOrmConfigModule {}
