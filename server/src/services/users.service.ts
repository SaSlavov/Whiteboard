import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/entities/user.entity';
import * as bcrypt from 'bcrypt'
import { CreateUserDTO } from 'src/models/dtos/userDTOs/create-user.dto';
import { ReturnUserDTO } from 'src/models/dtos/userDTOs/return-user.dto';
import * as nodemailer from 'nodemailer'
import { UserInfoDTO } from 'src/models/dtos/userDTOs/user-info-dto';
import { Board } from 'src/models/entities/board.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        @InjectRepository(Board) private readonly boardsRepository: Repository<Board>,
    ) { }

    async create(userDto: CreateUserDTO): Promise<ReturnUserDTO> {
        const checkForUserAlreadyExist = await this.usersRepository.findOne({
            where: {
                username: userDto.username,
            },
        });
        if (!checkForUserAlreadyExist) {
            const user = this.usersRepository.create(userDto);
            user.password = await bcrypt.hash(user.password, 10);

            const created = await this.usersRepository.save(user);

            const confirmationLink = `http://localhost:4000/confirmation/${user.id}`

            await this.sendConfirmationEmail( userDto.email, confirmationLink)

            return {
                id: created.id,
                username: created.username,
                boardsInvitations: created.boardsInvitations,
            }

        } else {
            throw new BadRequestException(`User with name ${userDto.username} already exist!`);
        }
    }

    async sendConfirmationEmail( userEmail: string, link: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'whiteboard.platform.online@gmail.com',
                pass: 'osemznaka8'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: 'Online Whiteboard team',
            to: `${userEmail}`,
            subject: 'Confirm your account',
            html: `<html><body><a href="${link}">confirm Email</a></body></html>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    async confirmAccount(userId: number): Promise<{ msg: string }> {
        const user = await this.usersRepository.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new BadRequestException('User not found')
        }

        user.isConfirmed = true
        await this.usersRepository.save(user);

        return { msg: "Account has been confirmed!" }
    }
    async changePassword(userId: number, newPass: any): Promise<{ msg: string }> {
        const user = await this.usersRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new BadRequestException('User not found')
        }

        user.password = await bcrypt.hash(newPass.newPass.value, 10);
        await this.usersRepository.save(user);

        return { msg: "Password was changed!" }
    }
    async sendRecoverPassEmail(email: any): Promise<{ msg: string }> {
        const user = await this.usersRepository.findOne({
            where: {
                email: email.email,
            },
        });
        if (!user) {
            throw new BadRequestException('User not found')
        }
        const recoverPassLink = `http://localhost:4000/forgotten_pass/${user.id}`

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'whiteboard.platform.online@gmail.com',
                pass: 'osemznaka8'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: 'Online Whiteboard team',
            to: `${email.email}`,
            subject: 'Forgotten password',
            html: `<html><body><a href="${recoverPassLink}">Change password</a></body></html>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return { msg: "A link to make a new password has been sent to the provided email!" }
    };

    public async uploadAvatar(id: number, filename: string): Promise<string> {
        const user = await this.usersRepository.findOneOrFail(id);
        user.avatarUrl = filename;

        await this.usersRepository.save(user);

        return user.avatarUrl;

    };

    async getUserInfo(userId: number): Promise<UserInfoDTO> {
        const user = await this.usersRepository.findOneOrFail(userId);
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };
    };
    async getAllUsers(): Promise<ReturnUserDTO[]> {
        const users = await this.usersRepository.find({
            relations: ['boardsInvitations']
        });
        const transformedUsers = users.map((user) => {
            const newBoard = {
                id: user.id,
                username: user.username,
                boardsInvitations: user.boardsInvitations
            };
            return newBoard;
        });
        return transformedUsers
    };
    async inviteToBoard(boardId: number, userId: number, isUserInvited: any): Promise<any> {
        const user = await this.usersRepository.findOne({
            where: { id: userId},
            relations: ['boardsInvitations']
        });

        const board = await this.boardsRepository.findOne({
            where: { id: boardId},
            relations: ['author']

        });

        if (isUserInvited.isInvited ) {
            user.boardsInvitations = user.boardsInvitations.filter(board => board.id !== boardId);
        } else {
            user.boardsInvitations.push(board);
        }


        await this.usersRepository.save(user);
                
        return {msg: `User ${user.username} has been invited to board ${board.topic}`}
    };

};
