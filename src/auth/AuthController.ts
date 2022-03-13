import { Request, Response } from 'express';
import userService from '../user/UserService';
import bcrypt from 'bcrypt';
import asyncHandler  from 'express-async-handler';
import { AuthenticationException } from './exceptions/AuthenticationException';
import { ForbiddenException } from './exceptions/ForbiddenException';
import { createToken } from './TokenService';

export const logIn = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);
  if (!user) throw new AuthenticationException();

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AuthenticationException();

  if (user.inactive) throw new ForbiddenException();

  const token = await createToken(user);

   res.json({
    id: user.id,
    username: user.username,
    token
  });
  
});
