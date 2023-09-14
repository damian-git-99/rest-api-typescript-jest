import { describe, it, before, beforeEach } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { sequelize } from '../src/config/database'
import { User } from '../src/user/User'
import { app } from '../src/app'
import bcrypt from 'bcrypt'

const getUsers = (options: { token?: string } = {}) => {
  const agent = request(app).get('/api/1.0/users')
  if (options.token) {
    agent.set('Authorization', `Bearer ${options.token}`)
  }
  return agent
}

const activeUser = {
  username: 'user1',
  email: 'damian@mail.com',
  password: 'P4ssword',
  inactive: false
}

const auth = async () => {
  const hashPassword = await bcrypt.hash(activeUser.password, 10)
  await User.create({ ...activeUser, password: hashPassword })
  const response = await request(app)
    .post('/api/1.0/auth')
    .send({ email: activeUser.email, password: activeUser.password })
  const token: string = response.body.token
  return token
}

const addUsersToDB = async (
  activeUserCount: number,
  inactiveUserCount: number = 0
) => {
  const hash = await bcrypt.hash('P4ssword', 10)
  for (let i = 0; i < activeUserCount + inactiveUserCount; i++) {
    await User.create({
      username: `user${i + 1}`,
      email: `user${i + 1}@mail.com`,
      inactive: i >= activeUserCount,
      password: hash
    })
  }
}

describe('Listing users', () => {
  before(async () => {
    await sequelize.sync()
  })

  beforeEach(async () => {
    await User.destroy({ truncate: true })
  })

  it('returns 200 ok when there are no user in database', async () => {
    const token = await auth()
    const response = await getUsers({ token })
    assert.equal(response.status, 200)
  })

  it('returns all active users', async () => {
    const token = await auth()
    await addUsersToDB(10, 10)
    const response = await getUsers({ token })
    assert.equal(response.body.users.length, 10)
  })

  it('returns only id, username, email and image in content array for each user', async () => {
    const token = await auth()
    await addUsersToDB(11)
    const response = await getUsers({ token })
    const user = response.body.users[0]
    assert.deepEqual(Object.keys(user), ['id', 'username', 'email'])
  })
})
