import { Router } from 'express';
import { check } from 'express-validator';
import { signIn } from './UserController';
import { validateFields } from '../middlewares/expressValidator';
import userService from './UserService';

export const userRouter = Router();

userRouter.post(
  '/api/1.0/users',
  [
    check('username')
      .notEmpty()
      .withMessage('Username cannot be null')
      .bail() // avoid overwriting withMessage
      .isLength({ min: 4, max: 32 })
      .withMessage('Must have min 4 and max 32 characters'),
    check('email')
      .notEmpty()
      .withMessage('E-mail cannot be null')
      .bail()
      .isEmail()
      .withMessage('E-mail is not valid')
      .bail()
      .custom(async (email) => {
        const res = await userService.findByEmail(email);
        if (res) {
          throw new Error('E-mail in use');
        }
      }),
    check('password')
      .notEmpty()
      .withMessage('Password cannot be null')
      .bail()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
      .bail()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
      .withMessage(
        'Password must have at least 1 uppercase, 1 lowercase letter and 1 number'
      ),
    validateFields
  ],
  signIn
);
