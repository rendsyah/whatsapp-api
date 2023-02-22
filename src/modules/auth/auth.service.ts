// Import Modules
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

// Import Commons
import { HelperService } from '@commons/lib/helper/helper.service';
import { ApiBadRequestException, ApiForbiddenException, ApiUnauthorizedException } from '@commons/exception/api-exception';

// Import Datasource
import { ProjectDbService } from '@datasource/project-db/project-db.service';
import { LogsDbService } from '@datasource/logs-db/logs-db.service';

// Import Dto
import { AuthLoginDto, AuthRefreshDto, AuthRegisterDto } from './dto/auth.dto';

// Import Interfaces
import { IGetProjectDbModels } from '@datasource/interfaces/project-db.interface';
import { IGetLogsDbModels } from '@datasource/interfaces/logs-db.interface';
import { IAuthResponse, IAuthTokens } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
    private readonly projectDbModels: IGetProjectDbModels;
    private readonly logsDbModels: IGetLogsDbModels;

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly helperService: HelperService,
        private readonly projectDbService: ProjectDbService,
        private readonly logsDbService: LogsDbService,
    ) {
        this.projectDbModels = this.projectDbService.getModels();
        this.logsDbModels = this.logsDbService.getModels();
    }

    private async _authToken(params: IAuthTokens): Promise<string> {
        const accessToken = await this.jwtService.signAsync(params, {
            secret: this.configService.get('app.JWT_SECRET_KEY'),
            expiresIn: this.configService.get('app.JWT_EXPIRES_IN'),
        });

        return accessToken;
    }

    private async _authRefreshToken(params: IAuthTokens): Promise<string> {
        const refreshToken = this.jwtService.signAsync(params, {
            secret: this.configService.get('app.JWT_REFRESH_SECRET_KEY'),
            expiresIn: this.configService.get('app.JWT_REFRESH_EXPIRES_IN'),
        });

        return refreshToken;
    }

    async authLogin(dto: AuthLoginDto): Promise<IAuthResponse> {
        // const getUser = await this.projectDbModels.UsersModel.getOneUser({ username: dto.username });
        // const isMatch = await this.helperService.validateCompare(dto.password, getUser?.password || '');
        // if (!isMatch) {
        //     throw new ApiBadRequestException(['username', 'password'], 'username or password invalid');
        // }
        // const requestToken = {
        //     sub: getUser.id,
        //     username: getUser.username,
        //     role: getUser.role,
        // };
        // const getToken = await this._authToken(requestToken);
        // const getRefreshToken = await this._authRefreshToken(requestToken);
        // if (!getToken || !getRefreshToken) {
        //     throw new Error('process token failed');
        // }
        // const hashToken = await this.helperService.validateHash(getRefreshToken);
        // await this.projectDbModels.UsersModel.updateUserLogin({ id: getUser.id, hashToken: hashToken });
        // return {
        //     access_token: getToken,
        //     refresh_token: getRefreshToken,
        // };
        return {
            message: 'hehe',
        };
    }

    async authRegister(dto: AuthRegisterDto): Promise<IAuthResponse> {
        // const hashPassword = await this.helperService.validateHash(dto.password);
        // await this.projectDbModels.UsersModel.createUser({ ...dto, password: hashPassword });

        return {
            message: 'successfully registered',
        };
    }

    async authRefresh(dto: AuthRefreshDto): Promise</* IAuthResponse */ any> {
        // const getUser = await this.projectDbModels.UsersModel.getOneUser({ username: dto.username });
        // const validateToken = await this.helperService.validateCompare(dto.refreshToken, getUser.hashToken);
        // const isLogin = getUser.isLogin;
        // if (!validateToken) {
        //     throw new ApiUnauthorizedException('invalid refresh token');
        // }
        // if (!isLogin) {
        //     throw new ApiForbiddenException('access denied');
        // }
        // const accessToken = await this._authToken({ sub: getUser.id, username: getUser.username, role: getUser.role });
        // return {
        //     access_token: accessToken,
        // };
    }
}
