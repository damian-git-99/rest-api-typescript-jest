import express from 'express';
import { userRouter } from './user/UserRouter';
import { authRouter } from './auth/AuthRouter';
import { errorHandler } from './error/ErrorHandler';
export const app = express();

app.use(express.json());
app.use(userRouter);
app.use(authRouter);
app.use(errorHandler);