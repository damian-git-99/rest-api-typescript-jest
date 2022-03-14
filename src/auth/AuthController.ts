import { Request, Response } from 'express';
import userService from '../user/UserService';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import { AuthenticationException } from './exceptions/AuthenticationException';
import { ForbiddenException } from './exceptions/ForbiddenException';
import tokenService from './TokenService';

// @route POST /api/1.0/auth
export const logIn = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await userService.findByEmail(email);
  if (!user) throw new AuthenticationException();
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AuthenticationException();

  if (user.inactive) throw new ForbiddenException();

  const token = await tokenService.createToken(user);

  res.json({
    id: user.id,
    username: user.username,
    token
  });
});

// @route DELETE /api/1.0/logout
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;
  
  if (!authorization) {
    res.status(400).json({ message: 'invalid token' });
    return;
  }

  const token = authorization.substring(7);
  await tokenService.deleteToken(token);

  res.json({ message: 'token removed successfully' });
});

// @route POST /api/1.0/users
export const signIn = async (req: Request, res: Response) => {
  await userService.signIn(req.body);
  res.status(200).send({ message: 'User Created' });
};
