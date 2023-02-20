// Import Modules
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

// Import Pipe
import { AuthLoginSchema, AuthRegisterSchema } from './auth.pipe';

// Import Commons
import { JwtAuthGuard, JwtRefreshAuthGuard, RolesAuthGuard } from '@commons/config/jwt/guards';
import { ApiGetServiceDocs, ApiPostServiceDocs } from '@commons/config/swagger/api-swagger.docs';
import { Roles } from '@commons/decorator/role.decorator';
import { User } from '@commons/decorator/user.decorator';

// Import Dto
import { AuthLoginDto, AuthRefreshDto, AuthRegisterDto } from './dto/auth.dto';

// Import Interfaces
import { IRole } from '@commons/decorator/interfaces';

// Import Service
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiPostServiceDocs(AuthLoginDto, 'login')
    async authLogin(@Body(AuthLoginSchema) dto: AuthLoginDto) {
        return await this.authService.authLogin(dto);
    }

    @Roles(IRole.Admin)
    @UseGuards(JwtAuthGuard, RolesAuthGuard)
    @Post('register')
    @ApiSecurity('authentication')
    @ApiPostServiceDocs(AuthRegisterDto, 'register')
    async authRegister(@Body(AuthRegisterSchema) dto: AuthRegisterDto) {
        return await this.authService.authRegister(dto);
    }

    @UseGuards(JwtRefreshAuthGuard)
    @Get('refresh')
    @ApiSecurity('authentication')
    @ApiGetServiceDocs('refresh token')
    async authRefresh(@User() dto: AuthRefreshDto) {
        return await this.authService.authRefresh(dto);
    }
}
