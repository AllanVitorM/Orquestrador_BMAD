import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationService } from 'src/conversation/conversation.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
})
export class OrquestradorGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly conversationService: ConversationService) {}
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    // Aqui garantimos que o ConversationService use o MESMO Server do Gateway
    this.conversationService.setSocketServer(server);
  }

  handleConnection(client: any) {
    console.log(`🟢 Cliente conectado: ${client.id}`);
  }
  handleDisconnect(client: any) {
    console.log(`🔴 Cliente desconectado: ${client.id}`);
  }
  @SubscribeMessage('message')
  async handleMessage(@MessageBody() payload: any) {
    const { conversationId, text } = payload;

    if (!conversationId) {
      console.log('❌ ERRO: mensagem recebida sem conversationId!');
      return;
    }
    // Chamando o conversation service, que salva no BD e emite socket
    await this.conversationService.addMessage(conversationId, {
      sender: 'user',
      text,
    });

    return true;
  }

  @SubscribeMessage('join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    client.join(conversationId);

    client.emit('joined', { conversationId });
  }
}
