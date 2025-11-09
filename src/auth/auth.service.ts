import { Injectable } from '@nestjs/common';
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

  login(user: jwtPayload) {
    const payload = {
      sub: user.sub,
      email: user.email,
      name: user.name,
    };

    const token = this.jwtservice.sign(payload);
    return {
      access_token: token,
    };
  }
}
