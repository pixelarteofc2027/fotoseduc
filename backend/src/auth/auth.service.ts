import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) return null;
    const matches = await bcrypt.compare(pass, user.password);
    if (matches) {
      // remove password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user as any;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    // create a simple refresh token (for demo), store in DB
    const refresh = await this.usersService.createRefreshToken(user.id);
    return {
      accessToken,
      refreshToken: refresh.token,
    };
  }

  async register(data: { email: string; password: string; name?: string }) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      email: data.email,
      password: hashed,
      name: data.name,
    });
    return user;
  }
}
