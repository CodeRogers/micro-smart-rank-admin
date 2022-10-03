import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASS}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}/${process.env.RMQ_VHOST}`,
      ],
      // urls: [process.env.RMQ_URI],
      noAck: false,
      queue: process.env.QUEUE,
    },
  });

  await app.listen();
}
bootstrap();
