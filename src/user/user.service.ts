import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    const salt = await bcrypt.genSalt();

    data.password = await bcrypt.hash(data.password, salt);

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
    if (typeof data.birthAt !== 'undefined' && data.birthAt !== null) {
      data.birthAt = new Date(data.birthAt).toISOString();
    }

    const salt = await bcrypt.genSalt();

    data.password = await bcrypt.hash(data.password, salt);

    return this.prisma.user.update({
      data,
      where: {
        id,
      },
    });
  }

  async updatePartial(@Param() data: UpdatePatchUserDTO, id: number) {
    await this.exists(id);

    const update: UpdatePatchUserDTO = {};

    if (typeof data.birthAt !== 'undefined' && data.birthAt !== null) {
      update.birthAt = new Date(data.birthAt).toISOString();
    }

    if (typeof data.email !== 'undefined' && data.email !== null) {
      update.email = data.email;
    }

    if (typeof data.password !== 'undefined' && data.password !== null) {
      const salt = await bcrypt.genSalt();

      update.password = await bcrypt.hash(data.password, salt);
    }

    if (typeof data.name !== 'undefined' && data.name !== null) {
      update.name = data.name;
    }

    if (typeof data.role !== 'undefined' && data.role !== null) {
      update.role = data.role;
    }

    return this.prisma.user.update({
      data,
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
