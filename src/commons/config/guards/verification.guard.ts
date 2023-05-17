// Import Modules
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

// Import Datasource
// import { ProjectDbService } from '@datasource/project-db/project-db.service';
// import { IProjectDbModels } from '@datasource/interfaces/project-db.interface';

// Import Api Exceptions
import { ApiForbiddenException } from '@commons/exception/api-exception';

// Import Logger Service
import { apiLoggerService } from '@commons/logger';

@Injectable()
export class VerificationAuthGuard implements CanActivate {
    // private projectDbModels: IProjectDbModels;

    // constructor(private readonly projectDbService: ProjectDbService) {
    //     this.projectDbModels = this.projectDbService.getModels();
    // }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // const getRequest = context.switchToHttp().getRequest();
        // const getUserId = getRequest?.user?.userId;

        // const getUser = await this.projectDbModels.UsersModels.findOne({ where: { id: getUserId, status: 1, is_verified: 1 } });

        // if (!getUser) {
        //     apiLoggerService.error('user not verified', { service: 'verification-middleware' });
        //     throw new ApiForbiddenException(['user'], 'user not verified');
        // }

        return true;
    }
}
