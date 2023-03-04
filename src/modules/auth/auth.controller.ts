// Import Modules
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

// Import Pipe
import { AuthLoginSchema, AuthRegisterSchema } from './auth.pipe';

// Import Commons
import { JwtAuthGuard, JwtRefreshAuthGuard } from '@commons/config/jwt/guards';
import { ApiGetServiceDocs, ApiPostServiceDocs } from '@commons/config/swagger/api-swagger.docs';
import { User } from '@commons/decorator/user.decorator';

// Import Dto
import { AuthLoginDto, AuthRegisterDto, AuthUsersDto } from './dto/auth.dto';

// Import Service
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiPostServiceDocs('login', AuthLoginDto)
    async authLoginController(@Body(AuthLoginSchema) dto: AuthLoginDto) {
        return await this.authService.authLogin(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('register')
    @ApiSecurity('authorization')
    @ApiPostServiceDocs('register', AuthRegisterDto)
    async authRegisterController(@Body(AuthRegisterSchema) dto: AuthRegisterDto) {
        return await this.authService.authRegister(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    @ApiSecurity('authorization')
    @ApiGetServiceDocs('logout')
    async authLogoutController(@User() dto: AuthUsersDto) {
        return await this.authService.authLogout(dto);
    }

    @UseGuards(JwtRefreshAuthGuard)
    @Get('refresh')
    @ApiSecurity('authorization')
    @ApiGetServiceDocs('refresh token')
    async authRefreshController(@User() dto: AuthUsersDto) {
        return await this.authService.authRefresh(dto);
    }
}
