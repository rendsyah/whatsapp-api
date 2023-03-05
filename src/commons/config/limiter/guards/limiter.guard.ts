// Import Modules
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

// Import Api Exceptions
import { ApiTooManyRequestException } from '@commons/exception/api-exception';

// Import Logger Service
import { apiLoggerService } from '@commons/logger';

@Injectable()
export class LimiterGuard extends ThrottlerGuard {
    protected throwThrottlingException(context: ExecutionContext): void {
        apiLoggerService.error(`${context}`, { service: 'middleware' });
        throw new ApiTooManyRequestException('too many requests');
    }
}
