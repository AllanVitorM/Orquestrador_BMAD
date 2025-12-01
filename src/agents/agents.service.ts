import { Injectable } from '@nestjs/common';
import { MultiAgentes } from 'src/constants';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AgentsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async dispatchAgent(domain: string, agent: string, payload: any) {
    const agentUrls: Record<string, string> = {
      frontend: this.config.get<string>('Agents.frontend') || '',
      ux: this.config.get<string>('Agents.ux') || '',
      database: this.config.get<string>('Agents.database') || '',
      qa: this.config.get<string>('Agents.testes') || '',
      backend: this.config.get<string>('Agents.backend') || '',
      devops: this.config.get<string>('Agents.devops') || '',
    };

    const url = `${agentUrls[domain]}/${agent}`;

    const obs = this.httpService.post(url, payload);
    const response: AxiosResponse<any> = await lastValueFrom(obs);
    return this.normalizeResponse(response.data);
  }

  chooseDomain(text: string) {
    const t = text.toLowerCase().split(/\W+/);
    for (const entry of MultiAgentes) {
      if (entry.keywords.some((k) => t.includes(k))) {
        return entry.domain;
      }
    }
    return 'frontend';
  }

  chooseAgent(text: string, domain: string): string {
    const t = text.toLowerCase();

    const domainEntry = MultiAgentes.find((d) => d.domain === domain);
    if (!domainEntry) return 'backlog';

    for (const agent of domainEntry.agents) {
      if (agent.keywords.some((k) => t.includes(k))) {
        return agent.name;
      }
    }

    return domainEntry.agents[0].name;
  }

  normalizeResponse(data: any) {
    const singleKey = Object.keys(data).find(
      (k) => typeof data[k] === 'string',
    );
    if (singleKey) {
      return {
        success: true,
        content: data[singleKey],
        raw: data,
      };
    }

    if (Array.isArray(data.steps)) {
      return {
        success: true,
        content: data.steps.join('\n\n'),
        raw: data,
      };
    }

    return {
      success: true,
      content: '```\n' + JSON.stringify(data, null, 2) + '\n```',
      raw: data,
    };
  }
}
