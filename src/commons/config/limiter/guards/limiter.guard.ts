// Import Modules
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

// Import Api Exceptions
import { ApiTooManyRequestException } from '@commons/exception/api-exception';

@Injectable()
export class LimiterGuard extends ThrottlerGuard {
    protected throwThrottlingException(context: ExecutionContext): void {
        throw new ApiTooManyRequestException('too many requests');
    }
}
