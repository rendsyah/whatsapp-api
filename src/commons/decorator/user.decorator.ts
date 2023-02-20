// Import Modules
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Define User Decorator
export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const getUser = request?.user;

    return getUser;
});
