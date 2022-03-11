import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateFields = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors: { [key: string]: string } = {};
    for (let i = 0; i < errors.array().length; i++) {
      const error = errors.array()[i];
      validationErrors[error.param] = error.msg; // { username: 'Username cannot be null' }
    }
    return res.status(400).json({ validationErrors });
  }

  next();
};