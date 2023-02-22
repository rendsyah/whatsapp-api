// Import Modules
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Import Api Exceptions
import { ApiUnauthorizedException } from '@commons/exception/api-exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(error: any, user: any, context: ExecutionContext) {
        if (error || !user) {
            throw error || new ApiUnauthorizedException('invalid token');
        }

        return user;
    }
}
