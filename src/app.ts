import express from 'express';
import { userRouter } from './user/UserRouter';
export const app = express();

app.use(express.json());
app.use('', userRouter);