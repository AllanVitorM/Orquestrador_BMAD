import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtPayload } from 'src/interface/auth.interface';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt_secret') || 'default_secret',
    });
  }

  async validate(payload: jwtPayload) {
    const user = await this.userModel.findById(payload.sub);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      enterprise: user.enterprise,
    };
  }
}
