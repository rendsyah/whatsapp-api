// Import Modules
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Import Commons
import { ApiUnauthorizedException } from '@commons/exception/api-exception';

// Import Datasource
import { ProjectDbService } from '@datasource/project-db/project-db.service';

// Import Interfaces
// import { IAuthToken, IAuthTokenResponse } from '@modules/mobile/auth/interfaces/auth.interface';
import { IProjectDbModels } from '@datasource/interfaces/project-db.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    private projectDbModels: IProjectDbModels;

    constructor(configService: ConfigService, private readonly projectDbService: ProjectDbService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('app.SERVICE_JWT_SECRET_KEY'),
        });
        this.projectDbModels = this.projectDbService.getModels();
    }

    // async validate(payload: IAuthToken): Promise<IAuthTokenResponse> {
    //     const getUserId = payload.sub;
    //     const getDeviceId = payload.device;
    //     const getRole = payload.role;

    //     const getSession = await this.projectDbModels.SessionsModels.findOneUserSession(getUserId, getDeviceId);
    //     const getLastLogin = getSession?.login_at;

    //     if (!getSession || !getLastLogin) {
    //         throw new ApiUnauthorizedException(['token'], 'token invalid');
    //     }

    //     return {
    //         userId: getUserId,
    //         device: getDeviceId,
    //         role: getRole,
    //     };
    // }
}
