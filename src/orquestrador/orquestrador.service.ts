import { Injectable } from '@nestjs/common';
import { AgentsService } from 'src/agents/agents.service';

@Injectable()
export class OrquestradorService {
  constructor(private readonly agentsService: AgentsService) {}

  async delegateTask(payload: { text: string }) {
    const domain = this.agentsService.chooseDomain(payload.text);
    const agent = this.agentsService.chooseAgent(payload.text, domain);
    const result = await this.agentsService.dispatchAgent(
      domain,
      agent,
      payload,
    );
    return result;
  }
}
