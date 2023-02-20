// Import Modules
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// Import Interfaces
import { IPayload } from './interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request.headers?.authentication?.toString() || null;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('app.SERVICE_JWT_SECRET_KEY'),
        });
    }

    async validate(payload: IPayload) {
        return {
            userId: payload.sub,
            username: payload.username,
            role: payload.role,
        };
    }
}
