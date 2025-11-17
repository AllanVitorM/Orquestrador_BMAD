import { Module } from '@nestjs/common';
import { OrquestradorService } from './orquestrador.service';
import { OrquestradorController } from './orquestrador.controller';
import { AgentsModule } from 'src/agents/agents.module';
import { OrquestradorGateway } from './orquestrador.gateway';

@Module({
  imports: [AgentsModule],
  providers: [OrquestradorService, OrquestradorGateway],
  controllers: [OrquestradorController],
})
export class OrquestradorModule {}
