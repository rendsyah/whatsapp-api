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

    @ApiProperty({ example: 'test' })
    name: string;
}

// Define Auth Users Dto
export class AuthUsersDto {
    userId: number;
    username: string;
    refreshToken?: string;
}
