import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return { ok: true, user: { id: user.id, email: user.email } };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) return { ok: false, message: 'Invalid credentials' };
    const tokens = await this.authService.login(user);
    return { ok: true, ...tokens };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() body: { userId: number; refreshToken: string }) {
    const tokens = await this.authService.refresh(body.userId, body.refreshToken);
    if (!tokens) return { ok: false };
    return { ok: true, ...tokens };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Body() body: { refreshId: number }) {
    await this.authService.logout(body.refreshId);
    return { ok: true };
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot')
  async forgot(@Body() body: { email: string }) {
    await this.authService.forgot(body.email);
    return { ok: true };
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset')
  async reset(@Body() body: { token: string; password: string }) {
    const ok = await this.authService.reset(body.token, body.password);
    return { ok };
  }
}
