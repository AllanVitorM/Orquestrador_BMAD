import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dbConnection = mongoose.connection;

  dbConnection.on('error', (error) => {
    console.error('Falha ao conectar com o mongoDb', error);
  });

  dbConnection.once('open', () => {
    console.log('Banco online');
  });


  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(8080);
  console.log(`Orquestrador rodando!`);
}
bootstrap();
