import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Post()
  async create(@Body() body) {
    return { body };
  }

  @Get()
  async read(@Body() body) {
    return { user: { body } };
  }

  @Get(':id')
  async readOne(@Param() param) {
    return { user: {}, param };
  }

  @Put(':id')
  async update(@Body() meupaunoteucu, @Param() params) {
    return {
      method: 'put',
      meupaunoteucu,
      params,
    };
  }

  @Patch()
  async updatePartial(@Body() body, @Param() params) {
    return {
      method: 'patch',
      body,
      params,
    };
  }

  @Delete(':id')
  async delete(@Param() params) {
    return {
      params,
    };
  }
}
