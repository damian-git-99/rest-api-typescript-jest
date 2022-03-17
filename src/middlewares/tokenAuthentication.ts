import { Request, Response, NextFunction } from 'express';
import tokenService from '../auth/TokenService';

export const tokenAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '');
    try {
      const user = await tokenService.verify(token);
      req.authenticatedUser = user;
      next();
    } catch (err) {
      return res.status(403).json({
        message: 'the token is invalid or does not come in the http header'
      });
    }
  } else {
    return res.status(403).json({
      message: 'the token is invalid or does not come in the http headers'
    });
  }
};
