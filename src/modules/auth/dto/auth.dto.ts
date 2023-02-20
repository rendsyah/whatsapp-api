import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
    @ApiProperty({ example: 'test' })
    username: string;

    @ApiProperty({ example: '123' })
    password: string;
}

export class AuthRegisterDto {
    @ApiProperty({ example: 'test' })
    username: string;

    @ApiProperty({ example: '123' })
    password: string;

    @ApiProperty({ example: 'user' })
    role: string;
}

export class AuthRefreshDto {
    sub: string;
    username: string;
    role: string;
    refreshToken: string;
}
