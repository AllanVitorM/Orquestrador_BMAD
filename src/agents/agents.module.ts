import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}
