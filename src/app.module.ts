import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrquestradorModule } from './orquestrador/orquestrador.module';

@Module({
  imports: [OrquestradorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {};
