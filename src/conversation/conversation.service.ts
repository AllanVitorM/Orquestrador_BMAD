import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './conversation.schema';
import { Message } from './message.schema';
import { ConversationDTO } from './conversation.dto';
import { MessageDTO } from './message.dto';
import { Server } from 'socket.io';
import { OrquestradorService } from 'src/orquestrador/orquestrador.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    private readonly orquestrador: OrquestradorService,
  ) {}

  io: Server;

  setSocketServer(io: Server) {
    this.io = io;
  }

  async createConversation(dto: ConversationDTO) {
    return this.conversationModel.create(dto);
  }

  async getUserConversation(userId: string) {
    return this.conversationModel
      .find({ userId })
      .sort({ updatedAt: -1 })
      .exec();
  }

  async getConversationHistory(conversationId: string) {
    return this.messageModel
      .find({ conversationId })
      .sort({ createdAt: 1 })
      .exec();
  }

  async addMessage(conversationId: string, dto: MessageDTO) {
    await this.conversationModel.findByIdAndUpdate(conversationId, {
      updatedAt: new Date(),
    });

    if (dto.sender === 'user') {
      const conv = await this.conversationModel.findById(conversationId);
      if (conv && (!conv.title || conv.title.trim() === '')) {
        await this.conversationModel.findByIdAndUpdate(conversationId, {
          title: dto.text.slice(0, 50), // limita o tamanho
        });
      }
    }

    const userMsg = await this.messageModel.create({
      conversationId,
      ...dto,
    });

    const agentResponse = await this.orquestrador.delegateTask({
      text: dto.text,
    });
    const replyText =
      typeof agentResponse === 'string'
        ? agentResponse
        : agentResponse.content
          ? String(agentResponse.content)
          : JSON.stringify(agentResponse);

    const agentMsg = await this.messageModel.create({
      conversationId,
      sender: 'agent',
      text: replyText,
    });

    if (this.io) {
      this.io.to(conversationId).emit('message', {
        conversationId,
        sender: 'agent',
        text: replyText,
      });
    } else {
      console.log('❌ ERRO: this.io está NULL, socket não inicializado');
    }
    return {
      user: userMsg,
      agent: agentMsg,
    };
  }

  async getMessages(conversationId: string) {
    return this.conversationModel
      .findById(conversationId)
      .select('messages')
      .lean();
  }

  async deleteConversation(conversationId: string, userId: string) {
    const conv = await this.conversationModel.findOne({
      _id: conversationId,
      userId: userId,
    });
    if (!conv) {
      throw new Error('Conversa não encontrada ou não autorizada');
    }

    await this.messageModel.deleteMany({ conversationId });

    await this.conversationModel.findByIdAndDelete(conversationId);

    return { sucess: true };
  }
}
