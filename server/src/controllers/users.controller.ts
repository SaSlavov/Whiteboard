import { Controller, Post, Body, ValidationPipe, Put, Param, Get, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ReturnUserDTO } from 'src/models/dtos/userDTOs/return-user.dto';
import { CreateUserDTO } from 'src/models/dtos/userDTOs/create-user.dto';
import { UsersService } from 'src/services/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserInfoDTO } from 'src/models/dtos/userDTOs/user-info-dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
    ) { }

    @Post()
    async createUser(
        @Body(new ValidationPipe({ whitelist: false })) newUser: CreateUserDTO
    ): Promise<ReturnUserDTO> {
        return await this.userService.create(newUser);
    };

    @Get()
    async getAllUsers(): Promise<ReturnUserDTO[]> {
        return await this.userService.getAllUsers();
    };

    @Put(':id')
    async confirmAccount(@Param('id') userId: string): Promise<{ msg: string}> {
        return await this.userService.confirmAccount(+userId);
    };

    @Post(':id/recover_pass')
    async changePassword(
        @Param('id') userId: string,
        @Body() newPass: any
    ): Promise<{ msg: string}> {
        return await this.userService.changePassword(+userId, newPass);
    };

    @Post('recover_email')
    async sendRecoverPassEmail(
        @Body() email: any
    ): Promise<{ msg: string}> {
        return await this.userService.sendRecoverPassEmail(email);
    };

    @Post(':id/avatar')
    @UseInterceptors(
        FileInterceptor('files', {
            storage: diskStorage({
                destination: './avatars',
                filename: (req, file, cb) => {
                    // Generating a 32 random chars long string
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    //Calling the callback passing the random name generated with the original extension name
                    cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
    )

    async uploadAvatar(
        @UploadedFile() files,
        @Param('id') id: string,
    ): Promise<string> {
        return await this.userService.uploadAvatar(+id, files.filename)
    };

    @Get(':id')
    async getUserInfo(@Param('id') userId: string): Promise<UserInfoDTO> {
        return await this.userService.getUserInfo(+userId);
    }

    @Put('/:userId/invite/:boardId')
    async inviteToBoard(
        @Param('boardId') boardId: string,
        @Param('userId') userId: string,
        @Body() isUserInvited: any
    ): Promise<{ msg: string}> {
        
        return await this.userService.inviteToBoard(+boardId, +userId, isUserInvited);
    };

};
