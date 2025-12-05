import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { jwtPayload } from '../interface/auth.interface';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, User } from 'src/user/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtservice: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) return user;
    }
    return null;
  }

  generateAccessToken(payload: any) {
    return this.jwtservice.sign(payload, {
      expiresIn: '15m',
    });
  }

  generateRefreshToken(payload: any) {
    return this.jwtservice.sign(payload, {
      secret: process.env.jwt_secret,
      expiresIn: '7d',
    });
  }

  login(user: jwtPayload) {
    const payload = {
      sub: user.sub,
      email: user.email,
      name: user.name,
    };

    const access_token = this.generateAccessToken(payload);
    const refresh_token = this.generateRefreshToken(payload);

    return {
      access_token,
      refresh_token,
      user,
      
    };
  }

  refresh(refresh_token: string) {
    try {
      const decoded = this.jwtservice.verify(refresh_token, {
        secret: process.env.jwt_secret,
      });

      const new_access_token = this.generateAccessToken({
        sub: decoded.sub,
        email: decoded.email,
        name: decoded.name,
      });

      return { access_token: new_access_token };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }
}
