import { BadRequestException, Body, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

import { AuthForgetDTO } from 'src/user/dto/auth-forget.dto';
import { AuthLoginDTO } from 'src/user/dto/auth-login.dto';
import { AuthRegisterDTO } from 'src/user/dto/auth-register.dto';
import { AuthResetDTO } from 'src/user/dto/auth-reset.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileService } from 'src/file/file.service';
import { User } from 'src/decorators/user.decorator';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService
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

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User() user) {
    return { user };
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(@User() user, @UploadedFile(new ParseFilePipe({
    validators: [
      new FileTypeValidator({ fileType: 'image/jpeg' }),
      new MaxFileSizeValidator({ maxSize: 1024 * 20 })
    ]
  })) photo: Express.Multer.File) {

    const path = join(__dirname, '../../storage/photos', `photo-${user.id}.png`);

    try {
      await this.fileService.upload(photo, path);
    } catch (e) {
      throw new BadRequestException(e)
    }

    return { success: true };
  }


  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('files')
  async uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[]) {

    return files

  }

  @UseInterceptors(FileFieldsInterceptor([{
    name: 'photo',
    maxCount: 10,

  }, {
    name: 'documents',
    maxCount: 10
  }]))
  @UseGuards(AuthGuard)
  @Post('files-fields')
  async uploadFileField(@User() user, @UploadedFiles() files: { photo: Express.Multer.File, documents: Express.Multer.File }) {

    return files;
  }
}
