import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.secretKey,
    }),
    PrismaModule,
    UserModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
