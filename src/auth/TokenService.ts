import { v4 as uuidv4 } from 'uuid';
import { Token } from './Token';
import { User } from '../user/User';
import { Op } from 'sequelize';

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

  async verify(token: string) {
    const validToken = await Token.findOne({ where: { token } });

    if (!validToken) throw new Error('Invalid Token');

    validToken.lastUsedAt = new Date();
    await validToken.save();
    const userId = validToken?.userId;

    return {
      id: userId
    };
  }

  async scheduleCleanupOldTokens() {
    const ONE_HOUR = 60 * 60 * 1000;
    const ONE_WEEK_IN_MILLIS = 7 * 24 * 60 * 60 * 1000;
    setInterval(async () => {
      const oneWeekAgo = new Date(Date.now() - ONE_WEEK_IN_MILLIS);
      await Token.destroy({
        where: {
          lastUsedAt: {
            [Op.lt]: oneWeekAgo
          }
        }
      });
    }, ONE_HOUR);
  }
}

const tokenService = new TokenService();
export default tokenService;
