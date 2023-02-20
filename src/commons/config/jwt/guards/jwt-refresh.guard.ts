// Import Modules
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Import Api Exceptions
import { ApiUnauthorizedException } from 'src/commons/exception/api-exception';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
    handleRequest(error: any, user: any, context: ExecutionContext) {
        if (error || !user) {
            throw error || new ApiUnauthorizedException('invalid refresh token');
        }

        return user;
    }
}
