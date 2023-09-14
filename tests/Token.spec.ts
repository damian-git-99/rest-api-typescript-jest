import { describe, it, before, beforeEach } from 'node:test'
import assert from 'node:assert'
import { sequelize } from '../src/config/database'
import { v4 as uuidv4 } from 'uuid'
import { Token } from '../src/auth/Token'
import tokenService from '../src/auth/TokenService'

describe('Scheduled Token Cleanup', () => {
  before(async () => {
    await sequelize.sync()
  })

  beforeEach(async () => {
    await Token.destroy({ truncate: true })
  })

  it('clears the expired token with scheduled task', async (context) => {
    context.mock.timers.enable(['setInterval'])
    const token = uuidv4()
    const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    await Token.create({
      token: token,
      lastUsedAt: eightDaysAgo,
      userId: 1
    })
    tokenService.scheduleCleanupOldTokens()

    context.mock.timers.tick(60 * 60 * 1000 + 5000)
    const tokenInDB = await Token.findOne({ where: { token: token } })
    assert.equal(tokenInDB, null)
  })
})
