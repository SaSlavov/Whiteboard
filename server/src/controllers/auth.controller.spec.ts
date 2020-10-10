import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '../models/entities/token.entity';
import { UserLoginDTO } from '../models/dtos/userDTOs/user-login-dto';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('Auth Controller', () => {
  let controller: AuthController;
  const authService = {
    login(user: UserLoginDTO) {},
    addToBlacklist() {},
    toggleOnline() {},
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login should call authService.login', async () => {
    const spy = jest.spyOn(authService, 'login');
    const user: UserLoginDTO = {
      username: 'Slavi',
      password: 'root1'
    }

    await controller.login(user);

    expect(authService.login).toHaveBeenCalledTimes(1)

    spy.mockClear();

  });

  it('login should return the result from authService.login', async () => {
    const spy = jest.spyOn(authService, 'login').mockImplementation(async () => 'test');
    const user: UserLoginDTO = {
      username: 'Slavi',
      password: 'root1'
    }
    const response = await controller.login(user);

    expect(response).toBe(test);

    spy.mockClear();
  })

  it('logout should call authService.toggleOnline with the correct argument', async () => {
    const user = {
      user: {
        id: 28,
        username: 'Slavi',
        password: 'root1'
      }
    };
    const spy = jest.spyOn(authService, 'toggleOnline');
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsInVzZXJuYW1lIjoiU2xhdmkiLCJyb2xlIjoiZ3Vlc3QiLCJhdmF0YXJVcmwiOiI4ODA0MzZkZmY5OTdkOTkyYjAxMDRhMmY3MzE4MWNlYmIuanBnIiwiYmFuRW5kRGF0ZSI6bnVsbCwiaWF0IjoxNjAxMDM2ODQxLCJleHAiOjE2MDE2NDE2NDF9.2RDe_BB_1x6h38FHy4L8cbKESwl83Qs73FGi4BACrQQ'

    await controller.logout(user,token);

    expect(authService.toggleOnline).toHaveBeenCalledTimes(1);
    expect(authService.toggleOnline).toHaveBeenCalledWith(user.user.id);

    spy.mockClear();
  })


});
