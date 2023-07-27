import { Body, Controller, Post } from '@nestjs/common';
import { AuthForgetDTO } from 'src/user/dto/auth-forget.dto';
import { AuthLoginDTO } from 'src/user/dto/auth-login.dto';
import { AuthRegisterDTO } from 'src/user/dto/auth-register.dto';
import { AuthResetDTO } from 'src/user/dto/auth-reset.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthMeDTO } from 'src/user/dto/auth-me.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDTO) {
    return this.authService.reset(password, token);
  }

  @Post('me')
  async me(@Body() body: AuthMeDTO) {
    return this.authService.checkToken(body.token);
  }
}
