import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  UserType,
  type LoginRequest,
  type SignupRequest,
} from 'src/proto-interfaces/user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() request: LoginRequest) {
    return this.authService.login(request);
  }

  @Post('signup')
  signup(@Body() request: SignupRequest) {
    return this.authService.signup({
      ...request,
      // @ts-ignore
      userType: UserType[request.userType],
    });
  }

  @Get('user/:id')
  getUserById(@Param('id') userId: string) {
    return this.authService.getUserById(userId);
  }
}
