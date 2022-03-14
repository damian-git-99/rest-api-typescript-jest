import userService from './UserService';
import asyncHandler from 'express-async-handler';

// @route GET /api/1.0/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const authenticatedUser = req.authenticatedUser;
  const users = await userService.getUsers(authenticatedUser?.id);
  res.json({
    users
  });
});
