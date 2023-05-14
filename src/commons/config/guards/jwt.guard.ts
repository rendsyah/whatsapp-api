// Import Modules
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Import Api Exceptions
import { ApiUnauthorizedException } from '@commons/exception/api-exception';

// Import Logger Service
import { apiLoggerService } from '@commons/logger';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(error: any, user: any, context: ExecutionContext) {
        if (error || !user) {
            apiLoggerService.error(`${context || error}`, { service: 'auth-middleware' });
            throw error || new ApiUnauthorizedException(['token'], 'token invalid');
        }

        return user;
    }
}
