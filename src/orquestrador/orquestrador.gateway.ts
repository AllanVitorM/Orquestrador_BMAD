import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OrquestradorService } from './orquestrador.service';


@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class OrquestradorGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly orquestradorService: OrquestradorService) {}
  @WebSocketServer() server: Server;
  handleConnection(client: any) {
    console.log(' cliente conectado: ', client.id);
  }
  handleDisconnect(client: any) {
    console.log('cliente desconectado: ', client.id);
  }
  @SubscribeMessage('message')
  async handleMessage(client: any, @MessageBody() data: { text: string }) {
    console.log('Mensagem recebida do frontend:', data);

    const responseFromAgent = await this.orquestradorService.delegateTask(data);

    const formattedMessage = Object.entries(responseFromAgent)
      .map(([key, value]) => `**${key}**:\n${value}`)
      .join('\n\n');

    console.log('Resposta do OrquestradorService:', formattedMessage);

    if (client) {
      client.emit('message', {
        from: 'orquestrador',
        original: formattedMessage,
      });
    } else {
      console.warn('Cliente não definido');
      this.server.emit('message', {
        from: 'orquestrador',
        original: formattedMessage,
      });
    }
  }
}
