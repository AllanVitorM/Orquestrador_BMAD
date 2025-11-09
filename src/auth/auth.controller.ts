import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UnauthorizedException,
  UseGuards,
  Res,
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

    const { access_token } = this.authService.login({
      sub: user._id,
      email: user.email,
      name: user.name,
    });

    res.cookie('token', access_token, {
      httpOnly: true,
      secure: process.env.secure === 'false',
      sameSite: 'strict',
      path: '/',
    });

    return {
      message: 'Login realizado com sucesso',
      token: access_token,
      user,
    };
  }

  @UseGuards(JwtAuthGuards)
  @Get('me')
  getProfile(@Request() req) {
    const user = req.user;

    return {
      name: user.name,
      email: user.email,
      enterprise: user.enterprise,
    };
  }
}
