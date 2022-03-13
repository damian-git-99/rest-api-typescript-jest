import { v4 as uuidv4 } from 'uuid';
import { Token } from './Token';
import { User } from '../user/User';

export const createToken = async (user: User) => {
  const token = uuidv4();
  await Token.create({
    token: token,
    userId: user.id,
    lastUsedAt: new Date()
  });
  return token;
};
