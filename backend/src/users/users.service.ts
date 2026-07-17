import { Injectable } from '@nestjs/common';
import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { email: string; password?: string; name?: string }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });
  }

  async createRefreshToken(userId: number) {
    const token = Math.random().toString(36).slice(2);
    const hashed = await bcrypt.hash(token, 10);
    const rt = await this.prisma.refreshToken.create({
      data: { token: hashed, userId },
    });
    // return raw token for client
    return { token, id: rt.id };
  }
}
