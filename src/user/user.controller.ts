import { Body, Controller, Post, Get, Request, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './user.dto';

@Controller('users')
export class userController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO);
  }
}
