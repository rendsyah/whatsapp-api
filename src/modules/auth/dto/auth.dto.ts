// Import Modules
import { ApiProperty } from '@nestjs/swagger';

// Define Auth Login Dto
export class AuthLoginDto {
    @ApiProperty({ example: 'test' })
    username: string;

    @ApiProperty({ example: '123' })
    password: string;
}

// Define Auth Register Dto
export class AuthRegisterDto {
    @ApiProperty({ example: 'test' })
    username: string;

    @ApiProperty({ example: '123' })
    password: string;

    @ApiProperty({ example: 'user' })
    role: string;
}

// Define Auth Refresh Dto
export class AuthRefreshDto {
    sub: string;
    username: string;
    role: string;
    refreshToken: string;
}
