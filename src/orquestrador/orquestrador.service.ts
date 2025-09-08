import { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
// import {
//   ClientProxy,
//   ClientProxyFactory,
//   Transport,
// } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class OrquestradorService {
  //Necessário utilizar com o RabbitMQ e/ou Docker
  //manter isso comentado por hora

  // private client: ClientProxy;

  // constructor() {
  //   this.client = ClientProxyFactory.create({
  //     transport: Transport.RMQ,
  //     options: {
  //       urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
  //       queue: process.env.RABBITMQ_QUEUE,
  //       queueOptions: { durable: false },
  //     },
  //   });
  // }

  constructor(private readonly httpService: HttpService) {}

  async delegateTask(payload: { text: string; lang?: string }) {
    const obs = this.httpService.post<{
      original: string;
      translated: string;
      lang: string;
    }>('http://localhost:5001/translate', payload);
    const response = (await lastValueFrom(obs)) as AxiosResponse<{
      original: string;
      translated: string;
      lang: string;
    }>;
    return response.data;
  }

  // async delegateTask(payload: string) {
  //   return this.client.send({ cmd: 'process_task' }, payload);
  // }
}
