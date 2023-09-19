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
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
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
 *               $ref: './schemas.yaml/components/schemas/User'
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
 *     responses:
 *       204:
 *         description: User deleted successfully
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
 *     requestBody:
 *       description: Updated user data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: 'schemas.yaml/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../../swagger-docs/schemas.yaml#/components/schemas/User'
 *       400:
 *         description: Bad request - Invalid data provided
 *       404:
 *         description: User not found
 */
userRouter.put('/:id', updateUser)
