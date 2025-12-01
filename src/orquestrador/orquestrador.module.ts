import { Module, forwardRef } from '@nestjs/common';
import { OrquestradorService } from './orquestrador.service';
import { OrquestradorController } from './orquestrador.controller';
import { AgentsModule } from 'src/agents/agents.module';
import { OrquestradorGateway } from './orquestrador.gateway';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  imports: [AgentsModule, forwardRef(() => ConversationModule)],
  providers: [OrquestradorService, OrquestradorGateway],
  controllers: [OrquestradorController],
  exports: [OrquestradorService],
})
export class OrquestradorModule {}
