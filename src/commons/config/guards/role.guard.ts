// Import Modules
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Import Roles Decorator
import { ROLES_KEY } from '@commons/decorator';

// Import Api Exceptions
import { ApiForbiddenException } from '@commons/exception/api-exception';

// Import Logger Service
import { apiLoggerService } from '@commons/logger';

@Injectable()
export class RolesAuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    matchRole(roles: string[], userRole: string): boolean {
        return roles.some((role) => role === userRole);
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.getAllAndOverride(ROLES_KEY, [context.getHandler(), context.getClass()]);

        if (!requiredRole) {
            return true;
        }

        const getRequest = context.switchToHttp().getRequest();
        const getUserRole = getRequest?.user?.role || '';
        const getAccessRole = this.matchRole(requiredRole, getUserRole);

        if (!getAccessRole) {
            apiLoggerService.error('access denied', { service: 'role-middleware' });
            throw new ApiForbiddenException(['access'], 'access denied');
        }

        return getAccessRole;
    }
}
