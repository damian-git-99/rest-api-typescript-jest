import { describe, it, before, beforeEach } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { sequelize } from '../src/config/database'
import { User } from '../src/user/User'
import { app } from '../src/app'
import bcrypt from 'bcrypt'
import { Token } from '../src/auth/Token'

const activeUser = {
  username: 'user1',
  email: 'user1@mail.com',
  password: 'P4ssword',
  inactive: false
}

const addUser = async (user = { ...activeUser }) => {
  const hash = await bcrypt.hash(user.password, 10)
  user.password = hash
  return await User.create(user)
}

const postAuthentication = (credentials = {}) => {
  return request(app).post('/api/1.0/auth').send(credentials)
}

const logout = (options: { token?: string } = {}) => {
  const agent = request(app).delete('/api/1.0/logout')
  if (options.token) {
    agent.set('Authorization', `Bearer ${options.token}`)
  }
  return agent.send()
}

describe('Logout', () => {
  before(async () => {
    await sequelize.sync()
  })

  beforeEach(async () => {
    await User.destroy({ truncate: true })
  })

  it('returns 200 ok when authorized request send for logout', async () => {
    await addUser()
    const response = await postAuthentication({
      email: 'user1@mail.com',
      password: 'P4ssword'
    })
    const token = response.body.token
    await logout({ token: token })
    assert.equal(response.status, 200)
  })

  it('removes the token from database', async () => {
    await addUser()
    const response = await postAuthentication({
      email: 'user1@mail.com',
      password: 'P4ssword'
    })
    const token = response.body.token
    await logout({ token: token })
    const storedToken = await Token.findOne({ where: { token: token } })
    assert.equal(storedToken, null)
  })
})
