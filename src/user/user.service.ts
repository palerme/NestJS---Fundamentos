import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    const dateTime = data.birthAt ? new Date(data.birthAt).toISOString() : null;
    data.birthAt = dateTime;
    return this.prisma.user.create({
      data,
    });
  }

  async list() {
    return this.prisma.user.findMany();
  }

  async show(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async exists(id: number) {
    if (
      !(await this.prisma.user.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.prisma.user;
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
