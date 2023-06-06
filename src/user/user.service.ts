import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    return this.prisma.user.create({
      data,
    });
  }

  async list() {
    return this.prisma.user.findMany();
  }

  async listOne(@Param() id) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async show(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async exists(id: number) {
    if (!this.show(id)) {
      return new NotFoundException(`user ${id} not found!`);
    }
  }

  async update(@Param() data: UpdateUserDTO, id: number) {
    await this.exists(id);
    const dateTime = data.birthAt ? new Date(data.birthAt).toISOString() : null;
    data.birthAt = dateTime;
    return this.prisma.user.update({
      data,
      where: {
        id,
      },
    });
  }

  async updatePartial(@Param() data: UpdatePatchUserDTO, id: number) {
    await this.exists(id);
    const dateTime = data.birthAt ? new Date(data.birthAt).toISOString() : null;
    data.birthAt = dateTime;
    return this.prisma.user.update({
      data: data,
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    await this.exists(id);
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
