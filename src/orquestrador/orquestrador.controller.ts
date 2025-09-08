import { Controller, Post, Body } from '@nestjs/common';
import { OrquestradorService } from './orquestrador.service';

@Controller('orquestrador')
export class OrquestradorController {
  constructor(private readonly orquestradorService: OrquestradorService) {}

  @Post('send')
  async sendMessage(@Body() body: { text: string; lang?: string }) {
    const response = await this.orquestradorService.delegateTask(body);
    return { agent_response: response };
  }
}
