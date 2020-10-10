import { Controller, Post, Body, Put } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserLoginDTO } from '../models/dtos/userDTOs/user-login-dto';
import { GetToken } from '../auth/get-token.decorator';

@Controller('session')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }
    @Post()
    async login(@Body() user: UserLoginDTO):
        Promise<{ token: string }> {
       return await this.authService.login(user);
    }

    @Put()
    async logout(@Body() user: any, @GetToken() token: string): Promise<{ message: string }> {
        await this.authService.toggleOnline(user.user.id)

        await this.authService.addToBlacklist(token?.slice(7))
        return {
            message: 'You have been logged out!'
        }
    }
}
