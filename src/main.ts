import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.MQCONNECTION],
      queue: process.env.QUEUE,
    },
  });

  await app.listen();
}
bootstrap();
