import { v4 as uuidv4 } from 'uuid';
import { Token } from '../../src/auth/Token';
import tokenService from '../../src/auth/TokenService';
import { sequelize } from '../../src/config/database';

beforeAll(async () => {
  await sequelize.sync();
});

beforeEach(async () => {
  await Token.destroy({ truncate: true });
});

describe('Scheduled Token Cleanup', () => {
  it('clears the expired token with scheduled task', async () => {
    jest.useFakeTimers();
    const token = uuidv4();
    const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
    await Token.create({
      token: token,
      lastUsedAt: eightDaysAgo,
      userId: 1
    });

    tokenService.scheduleCleanupOldTokens();
    jest.advanceTimersByTime(60 * 60 * 1000 + 5000);
    const tokenInDB = await Token.findOne({ where: { token: token } });
    expect(tokenInDB).toBeNull();
  });
});
