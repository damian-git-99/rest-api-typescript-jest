import { Router } from 'express';
import { getAllUsers, getUser } from './UserController';

export const userRouter = Router();

userRouter.get('/api/1.0/users', getAllUsers);
userRouter.get('/api/1.0/users/:id', getUser);
