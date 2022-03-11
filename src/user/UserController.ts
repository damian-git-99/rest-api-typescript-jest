import { Request, Response } from 'express';
import userService from './UserService';

// @route POST /api/1.0/users
export const signIn = async (req: Request, res: Response) => {
  await userService.signIn(req.body);
  res.status(200).send({ message: 'User Created' });
};

