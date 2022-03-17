import { Router } from 'express';
import { getAllUsers, getUser, deleteUser } from './UserController';

export const userRouter = Router();

userRouter.get('/api/1.0/users', getAllUsers);
userRouter.get('/api/1.0/users/:id', getUser);
userRouter.delete('/api/1.0/users/:id', deleteUser);
