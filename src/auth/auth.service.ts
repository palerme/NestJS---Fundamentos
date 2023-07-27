import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from 'src/user/dto/auth-register.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) { }

  async createToken(user: User) {
    return {
      accesToken: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          subject: String(user.id),
          expiresIn: '1 day',
          audience: this.audience,
          issuer: this.issuer,
          //notBefore: Math.ceil((Date.now() + 1000 * 60 * 60) / 1000),
        },
      ),
    };
  }

  async checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      });

      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('E-mail incorreto.');
    }
    return true;
  }

  async reset(password: string, token: string) {
    await this.checkToken(token);
    if (!token) {
      return 'Usuário não encontrado';
    }
    const id = 0;
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);

    return this.createToken(user);
  }

  async isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }
}
