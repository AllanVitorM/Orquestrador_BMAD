import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dbConnection = mongoose.connection;

  dbConnection.on('error', (error) => {
    console.error("Falha ao conectar com o mongoDb", error);
  });

  dbConnection.once('open', () => {
    console.log("Banco online");
  })

  //Necessário utilizar com o RabbitMQ e/ou Docker

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [process.env.RABBITMQ_URL],
  //     queue: process.env.RABBITMQ_QUEUE,
  //     queueOptions: { durable: false },
  //   },
  // });
  // await app.startAllMicroservices();
  
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });


  await app.listen(process.env.PORT ?? 8080);
  console.log(`Orquestrador rodando!`)
}
bootstrap();
