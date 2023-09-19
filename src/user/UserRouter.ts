import { Router } from 'express'
import { getAllUsers, getUser, deleteUser, updateUser } from './UserController'

export const userRouter = Router()

/**
 * @swagger
 * tags:
 *   - name: users
 *     description: User-related operations
 */

/**
 * @swagger
 * /api/1.0/users:
 *   get:
 *     summary: Get the list of all users
 *     tags:
 *       - users
 *     security:
 *       - jwtAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               $ref: '#/components/schemas/UserResponse'
 *       403:
 *         description: Forbidden - JWT token missing or invalid
 */
userRouter.get('/', getAllUsers)

/**
 * @swagger
 * /api/1.0/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to retrieve
 *     security:
 *       - jwtAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       403:
 *         description: Forbidden - JWT token missing or invalid
 *       404:
 *         description: User not found
 */
userRouter.get('/:id', getUser)

/**
 * @swagger
 * /api/1.0/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to delete
 *     security:
 *       - jwtAuth: []
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden - JWT token missing or invalid
 *       404:
 *         description: User not found
 */
userRouter.delete('/:id', deleteUser)

/**
 * @swagger
 * /api/1.0/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to update
 *     security:
 *       - jwtAuth: []
 *     requestBody:
 *       description: Updated user data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Bad request - Invalid data provided
 *       403:
 *         description: Forbidden - JWT token missing or invalid
 *       404:
 *         description: User not found
 */
userRouter.put('/:id', updateUser)
