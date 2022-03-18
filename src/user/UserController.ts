import userService from './UserService';
import asyncHandler from 'express-async-handler';
import { ForbiddenException } from '../auth/exceptions/ForbiddenException';

// @route GET /api/1.0/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const authenticatedUser = req.authenticatedUser;
  const users = await userService.getUsers(authenticatedUser?.id);
  res.json({
    users
  });
});

// @route GET /api/1.0/users/:id
export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUser(parseInt(req.params.id));
  res.send(user);
});

// @route DELETE /api/1.0/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const authenticatedUser = req.authenticatedUser;

  if (!authenticatedUser || authenticatedUser.id.toString() != req.params.id) {
    throw new ForbiddenException();
  }
  await userService.deleteUserById(parseInt(req.params.id));
  res.json({
    message: 'user deleted successfully'
  });
});

// @route PUT /api/1.0/users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const authenticatedUser = req.authenticatedUser;

  if (!authenticatedUser || authenticatedUser.id.toString() != req.params.id) {
    throw new ForbiddenException();
  }
  const user = await userService.updateUser(parseInt(req.params.id), req.body);
  res.send(user);
});
