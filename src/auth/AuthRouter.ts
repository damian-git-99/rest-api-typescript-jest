import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/expressValidator';
import { logIn, logout } from './AuthController';
export const authRouter = Router();

authRouter.post(
  '/api/1.0/auth',
  [check('email').isEmail(), check('password').notEmpty(), validateFields],
  logIn
);

authRouter.delete('/api/1.0/logout', logout);