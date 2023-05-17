// Import Modules
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// Import Commons
import { HelperService } from '@commons/lib/helper/helper.service';
import { ApiUnauthorizedException } from '@commons/exception/api-exception';

// Import Datasource
// import { ProjectDbService } from '@datasource/project-db/project-db.service';

// Import Interfaces
// import { IAuthToken, IAuthTokenResponse } from '@modules/mobile/auth/interfaces/auth.interface';
// import { IProjectDbModels } from '@datasource/interfaces/project-db.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    // private projectDbModels: IProjectDbModels;
    // constructor(
    //     configService: ConfigService,
    //     private readonly helperService: HelperService,
    //     private readonly projectDbService: ProjectDbService,
    // ) {
    //     super({
    //         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //         ignoreExpiration: false,
    //         secretOrKey: configService.get('app.SERVICE_JWT_REFRESH_SECRET_KEY'),
    //         passReqToCallback: true,
    //     });
    //     this.projectDbModels = this.projectDbService.getModels();
    // }
    // async validate(request: Request, payload: IAuthToken): Promise<IAuthTokenResponse> {
    //     const getUserId = payload.sub;
    //     const getDeviceId = payload.device;
    //     const getRole = payload.role;
    //     const getRefreshToken = request.get('Authorization').split(' ')[1];
    //     const getSession = await this.projectDbModels.SessionsModels.findOneUserSession(getUserId, getDeviceId);
    //     if (!getSession) {
    //         throw new ApiUnauthorizedException(['token'], 'token invalid');
    //     }
    //     const getUserRefreshToken = getSession.hash_token;
    //     const getValidateRefreshToken = await this.helperService.validateCompare(getRefreshToken, getUserRefreshToken);
    //     if (!getValidateRefreshToken) {
    //         throw new ApiUnauthorizedException(['token'], 'token invalid');
    //     }
    //     return {
    //         userId: getUserId,
    //         device: getDeviceId,
    //         role: getRole,
    //     };
    // }
}
