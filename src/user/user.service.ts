import { Injectable, Param } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-put-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUser: CreateUserDTO) {
    return this.prisma.user.create({
      data: createUser,
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

  async updateOne(@Param() updateUser: UpdateUserDTO, id) {
    return this.prisma.user.update({
      data: updateUser,
      where: {
        id,
      },
    });
  }

  // async updatePartial(@Param() {}: UpdateUserDTO)
}
