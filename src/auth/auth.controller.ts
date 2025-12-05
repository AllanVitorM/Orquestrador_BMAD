import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UnauthorizedException,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuards } from './localAuthGuard';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);

    if (!user) {
      throw new UnauthorizedException('Usuário inválido!');
    }

    const payload = { sub: user._id, email: user.email, name: user.name };

    const access_token = this.authService.generateAccessToken(payload);
    const refresh_token = this.authService.generateRefreshToken(payload);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,   
      maxAge: 15 * 60 * 1000,

    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,   
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Login realizado com sucesso',
      user,
    };
  }

  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refresh_token = req.cookies['refresh_token'];

    if (!refresh_token) throw new UnauthorizedException('Sem refresh token');

    const newToken = this.authService.refresh(refresh_token);

    res.cookie('access_token', newToken.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return { message: 'Token atualizado' };
  }

  @UseGuards(JwtAuthGuards)
  @Get('me')
  getProfile(@Request() req) {
    const user = req.user;

    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      enterprise: user.enterprise,
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Logout realizado' };
  }
}
