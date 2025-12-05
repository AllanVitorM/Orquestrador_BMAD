import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

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
    origin: 'https://multiagentes-frontend.vercel.app',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  });

  app.use(cookieParser());
  await app.listen(process.env.PORT || 8080);
  console.log(`Orquestrador rodando!`);
}
bootstrap();
