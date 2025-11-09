import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from './user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDTO: CreateUserDTO): Promise<{ user: User }> {
    try {
      const userExist = await this.userModel.findOne({
        email: createUserDTO.email,
      });

      if (userExist) {
        throw new BadRequestException('E-mail já cadastrado.');
      }

      const saltHash = 10;
      const hashedPassword = await bcrypt.hash(
        createUserDTO.password,
        saltHash,
      );

      const createUser = new this.userModel({
        ...createUserDTO,
        password: hashedPassword,
      });

      const savedUser = await createUser.save();

      const userWithoutPassword: Partial<User> = savedUser.toObject();
      delete userWithoutPassword.password;

      return { user: userWithoutPassword as User };
    } catch (error) {
      console.error('Erro ao criar usuário: ', error);
      throw new BadRequestException('Erro ao Criar usuário');
    }
  }
}
