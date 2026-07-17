import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

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
      const { password, ...result } = user as any;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refresh = await this.usersService.createRefreshToken(user.id);
    return {
      accessToken,
      refreshToken: refresh.token,
      refreshId: refresh.id
    };
  }

  async refresh(userId: number, token: string) {
    const rt = await this.usersService.verifyRefreshToken(userId, token);
    if (!rt) return null;
    // issue new access token
    const user = await this.usersService.findByEmail((await this.usersService.findById(userId)).email);
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async logout(refreshId: number) {
    await this.usersService.revokeRefreshToken(refreshId);
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

  async forgot(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return;
    const token = await this.usersService.createPasswordReset(user.id, 30);
    // send email with token (link)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: Number(process.env.SMTP_PORT) || 1025,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined
    });
    const link = `${process.env.APP_URL || 'http://localhost:3000'}/auth/reset?token=${token}`;
    await transporter.sendMail({ from: process.env.SMTP_FROM || 'no-reply@fotoeduc.local', to: email, subject: 'Password reset', text: `Reset your password: ${link}` });
  }

  async reset(token: string, password: string) {
    const pr = await this.usersService.verifyPasswordReset(token);
    if (!pr) return false;
    await this.usersService.setPassword(pr.userId, password);
    await this.usersService.markPasswordResetUsed(pr.id);
    return true;
  }
}
