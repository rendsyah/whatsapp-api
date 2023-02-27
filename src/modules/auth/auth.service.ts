// Import Modules
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

// Import Commons
import { HelperService } from '@commons/lib/helper/helper.service';
import { ApiBadRequestException, ApiUnauthorizedException } from '@commons/exception/api-exception';

// Import Datasource
import { ProjectDbService } from '@datasource/project-db/project-db.service';

// Import Dto
import { AuthLoginDto, AuthRegisterDto, AuthUsersDto } from './dto/auth.dto';

// Import Interfaces
import { IGetProjectDbModels } from '@datasource/interfaces/project-db.interface';
import { IAuthResponse, IAuthTokens } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
    private readonly projectDbModels: IGetProjectDbModels;

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly helperService: HelperService,
        private readonly projectDbService: ProjectDbService,
    ) {
        this.projectDbModels = this.projectDbService.getModels();
    }

    private async _authToken(params: IAuthTokens): Promise<string> {
        const getToken = await this.jwtService.signAsync(params, {
            secret: this.configService.get('app.SERVICE_JWT_SECRET_KEY'),
            expiresIn: this.configService.get('app.SERVICE_JWT_EXPIRES_IN'),
        });

        return getToken;
    }

    private async _authRefreshToken(params: IAuthTokens): Promise<string> {
        const getRefreshToken = await this.jwtService.signAsync(params, {
            secret: this.configService.get('app.SERVICE_JWT_REFRESH_SECRET_KEY'),
            expiresIn: this.configService.get('app.SERVICE_JWT_REFRESH_EXPIRES_IN'),
        });

        return getRefreshToken;
    }

    async authLogin(dto: AuthLoginDto): Promise<IAuthResponse> {
        const getUser = await this.projectDbModels.UsersModels.findOne({ where: { username: dto.username } });
        const getMatching = await this.helperService.validateCompare(dto.password, getUser?.password);

        if (!getMatching) {
            throw new ApiBadRequestException(['username', 'password'], 'username or password invalid');
        }

        const requestPayloadToken = {
            sub: getUser.id,
            username: getUser.username,
        };

        const [getToken, getRefreshToken] = await Promise.all([
            this._authToken(requestPayloadToken),
            this._authRefreshToken(requestPayloadToken),
        ]);

        if (!getToken || !getRefreshToken) {
            throw new Error('process token failed');
        }

        const getHashRefreshToken = await this.helperService.validateHash(getRefreshToken);
        const getCurrentDate = this.helperService.validateTime(new Date(), 'datetime');
        await this.projectDbModels.UsersModels.update({ id: getUser.id }, { hash_token: getHashRefreshToken, login_at: getCurrentDate });

        return {
            access_token: getToken,
            refresh_token: getRefreshToken,
        };
    }

    async authRegister(dto: AuthRegisterDto): Promise<IAuthResponse> {
        const getUser = await this.projectDbModels.UsersModels.findOne({
            where: { username: dto.username },
        });

        if (getUser) {
            throw new ApiBadRequestException([dto.username], 'username already exists');
        }

        const getHashPassword = await this.helperService.validateHash(dto.password);
        const getCurrentDate = this.helperService.validateTime(new Date(), 'datetime');

        await this.projectDbModels.UsersModels.create({ ...dto, password: getHashPassword, register_at: getCurrentDate });

        return { message: 'successfully registered' };
    }

    async authLogout(dto: AuthUsersDto): Promise<IAuthResponse> {
        await this.projectDbModels.UsersModels.update({ id: dto.userId }, { hash_token: null, login_at: null });
        return { message: 'successfully logout' };
    }

    async authRefresh(dto: AuthUsersDto): Promise<IAuthResponse> {
        const getUser = await this.projectDbModels.UsersModels.findOne({ where: { id: dto.userId } });
        const getMatching = await this.helperService.validateCompare(dto.refreshToken, getUser.hash_token);

        if (!getMatching) {
            throw new ApiUnauthorizedException('invalid token');
        }

        const getToken = await this._authToken({ sub: getUser.id, username: getUser.username });

        return { access_token: getToken };
    }
}
