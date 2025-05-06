import express, { Application } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

import userRouter from '@/routes/user';
import config from '@/config';

const prisma = new PrismaClient();

const app: Application = express();

app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/user', userRouter);

const server = app.listen(config.server.port, () => {
  console.log(`http://${config.server.host}:${config.server.port} 실행`);
  console.log(`env: ${config.env}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log('서버 종료');
    process.exit(0);
  });
});

export { app, prisma };
