import { Router } from 'express'
import { check } from 'express-validator'
import { validateFields } from '../middlewares/expressValidator'
import { logIn, logout, signIn } from './AuthController'
import userService from '../user/UserService'
export const authRouter = Router()

/**
 * @swagger
 * tags:
 *   - name: auth
 *     description: Authentication-related operations
 */

/**
 * @swagger
 * /api/1.0/users:
 *   post:
 *     summary: create new user
 *     tags:
 *       - auth
 *     requestBody:
 *       description: User data
 *       required: true
 *       content:
 *        application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRequest'
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Bad request - Invalid data provided
 */
authRouter.post(
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
        const res = await userService.findByEmail(email)
        if (res) {
          throw new Error('E-mail in use')
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
)

/**
 * @swagger
 * /api/1.0/auth:
 *   post:
 *     summary: Authenticate user
 *     tags:
 *       - auth
 *     requestBody:
 *       description: User login data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Bad request - Invalid data provided
 *       401:
 *         description: Unauthorized - Invalid credentials
 *       403:
 *         description: Unauthorized - Inactive user
 *     description: |
 *       This endpoint allows users to authenticate by providing their email and password.
 *       Upon successful authentication, a token is generated and stored in the database,
 *       associated with the authenticated user.
 */
authRouter.post(
  '/api/1.0/auth',
  [check('email').isEmail(), check('password').notEmpty(), validateFields],
  logIn
)

/**
 * @swagger
 * /api/1.0/logout:
 *   delete:
 *     summary: Logout user
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: Logout successful
 *     description: |
 *       This endpoint allows users to log out by deleting their authentication token
 *       from the database. It effectively ends the user's current session.
 */
authRouter.delete('/api/1.0/logout', logout)
