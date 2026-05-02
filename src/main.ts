import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  app.enableCors({
    origin: ['http://localhost:5183', 'http://localhost:5178'],
  });
  await app.listen(port);
  console.log(`Listening at: ${port}`);
}
bootstrap();
