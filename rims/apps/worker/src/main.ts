import { NestFactory } from "@nestjs/core";
import { WorkerAppModule } from "./worker-app.module";

async function bootstrap() {
  const app = await NestFactory.create(WorkerAppModule);
  await app.listen(process.env.WORKER_PORT ?? 3002);
}
bootstrap();
