import { Injectable } from '@nestjs/common';
import { MultiAgentes } from 'src/constants';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class AgentsService {
  constructor(private readonly httpService: HttpService) {}

  async dispatchAgent(domain: string, agent: string, payload: any) {
    const agentUrls: Record<string, string> = {
      frontend: 'http://localhost:8081',
    };

    const url = `${agentUrls[domain]}/${agent}`;

    const obs = this.httpService.post(url, payload);
    const response: AxiosResponse<any> = await lastValueFrom(obs);
    return response.data;
  }

  chooseDomain(text: string) {
    const t = text.toLowerCase();
    for (const entry of MultiAgentes) {
      if (entry.keywords.some((k) => t.includes(k))) {
        return entry.domain;
      }
    }
    return 'frontend'; //
  }
  chooseAgent(text: string, domain: string): string {
    const t = text.toLowerCase();

    // Procura no MultiAgentes pelo domínio certo
    const domainEntry = MultiAgentes.find((d) => d.domain === domain);
    if (!domainEntry) return 'backlog'; // fallback

    // Escolhe o agente pelo texto
    for (const agent of domainEntry.agents) {
      if (agent.keywords.some((k) => t.includes(k))) {
        return agent.name;
      }
    }

    return 'backlog'; // fallback
  }
}
