import { Request, Response, NextFunction} from 'express';

interface MyError extends Error {
  status: number
}

export const errorHandler = (err: MyError, req: Request, res: Response, next: NextFunction) => {
  const { status, message } = err;
  res.status(status).send({
    message,
    path: req.originalUrl,
    timestamp: new Date().getTime()
  });
};
