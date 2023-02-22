// Import Modules
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// Import Commons
import { jwtConfigAsync } from '@commons/config/jwt/jwt.config';
import { JwtStrategy } from '@commons/config/jwt/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '@commons/config/jwt/strategies';
import { ProjectDbModule } from '@datasource/project-db/project-db.module';

// Import Service
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [JwtModule.registerAsync(jwtConfigAsync), ProjectDbModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}