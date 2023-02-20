// Import Modules
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

// Import Config
import { ApiRequestTimeoutException } from '../exception/api-exception';

@Injectable()
export class ApiTimeoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            timeout(30000),
            catchError((err) => {
                if (err instanceof TimeoutError) {
                    return throwError(() => new ApiRequestTimeoutException('request timeout'));
                }
                return throwError(() => err);
            }),
        );
    }
}
