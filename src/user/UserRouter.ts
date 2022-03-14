import { Router } from 'express';
import { getAllUsers } from './UserController';

export const userRouter = Router();

userRouter.get('/api/1.0/users', getAllUsers);
