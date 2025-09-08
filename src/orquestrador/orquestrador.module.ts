import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrquestradorService } from './orquestrador.service';
import { OrquestradorController } from './orquestrador.controller';

@Module({
  imports: [HttpModule],
  providers: [OrquestradorService],
  controllers: [OrquestradorController],
})
export class OrquestradorModule {}
