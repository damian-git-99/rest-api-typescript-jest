import { v4 as uuidv4 } from 'uuid';
import { Token } from './Token';
import { User } from '../user/User';

class TokenService {
  
  async createToken(user: User) {
    const token = uuidv4();
    await Token.create({
      token: token,
      userId: user.id,
      lastUsedAt: new Date()
    });
    return token;
  }

  async deleteToken(token: string) {
    await Token.destroy({ where: { token } });
  }
  
}

const tokenService = new TokenService();
export default tokenService;
