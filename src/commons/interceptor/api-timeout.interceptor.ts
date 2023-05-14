// Import Modules
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

// Import Api Exceptions
import { ApiRequestTimeoutException } from '@commons/exception/api-exception';

// Import Logger Service
import { apiLoggerService } from '../logger';

@Injectable()
export class ApiTimeoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            timeout(30000),
            catchError((error) => {
                if (error instanceof TimeoutError) {
                    apiLoggerService.error(`${error}`, { service: 'timeout-middleware' });
                    return throwError(() => new ApiRequestTimeoutException('request timeout'));
                }
                return throwError(() => error);
            }),
        );
    }
}
