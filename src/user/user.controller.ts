import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.create(data);
  }

  @Get()
  async list() {
    return this.userService.list();
  }

  @Get(':id')
  async listOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.listOne(id);
  }

  @Put(':id')
  async update(
    @Body() updateUser: UpdateUserDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.updateOne(updateUser, id);
  }

  // @Patch(':id')
  // async updatePartial(
  //   @Body() userUpdate: UpdatePatchUserDTO,
  //   @Param('id', ParseIntPipe) id: number,
  // ) {
  //   return this.userService.updatePartial(userUpdate, id);
  // }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return {
      id,
    };
  }
}
