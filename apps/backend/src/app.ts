import config from '@/config';
import express, { Application } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from '@/routes/user';
import interviewerRouter from '@/routes/interviewer';
import { authenticate } from '@/middleware/auth';

const prisma = new PrismaClient();

const app: Application = express();

app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/user', userRouter);
app.use('/interviewer', authenticate, interviewerRouter);

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
