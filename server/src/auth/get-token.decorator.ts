import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetToken = createParamDecorator((data: any, req: ExecutionContext) => {
    const request = req.switchToHttp().getRequest();

    return request.headers.authorization?.slice(7);
});