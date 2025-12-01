import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationDTO } from './conversation.dto';
import { MessageDTO } from './message.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  create(@Body() dto: ConversationDTO) {
    return this.conversationService.createConversation(dto);
  }

  @Get('user/:userId')
  getUserConversation(@Param('userId') userId: string) {
    return this.conversationService.getUserConversation(userId);
  }

  @Get('history/:id')
  getHistory(@Param('id') id: string) {
    return this.conversationService.getConversationHistory(id);
  }

  @Post(':id/message')
  addMessage(@Param('id') conversationId: string, @Body() dto: MessageDTO) {
    return this.conversationService.addMessage(conversationId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteOne(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.conversationService.deleteConversation(id, userId);
  }

}
