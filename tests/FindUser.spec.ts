import { describe, it, before, beforeEach } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { sequelize } from '../src/config/database'
import { User } from '../src/user/User'
import { app } from '../src/app'
import bcrypt from 'bcrypt'

const activeUser = {
  username: 'user1',
  email: 'damian@mail.com',
  password: 'P4ssword',
  inactive: false
}

const getUser = async (id = 100) => {
  const token = await auth()
  return request(app)
    .get('/api/1.0/users/' + id)
    .set('Authorization', `Bearer ${token}`)
    .send()
}

const auth = async () => {
  const hashPassword = await bcrypt.hash(activeUser.password, 10)
  await User.create({
    ...activeUser,
    password: hashPassword,
    email: 'damian2@mail.com'
  })
  const response = await request(app)
    .post('/api/1.0/auth')
    .send({ email: 'damian2@mail.com', password: activeUser.password })
  const token: string = response.body.token
  return token
}

describe('Get User', () => {
  before(async () => {
    await sequelize.sync()
  })

  beforeEach(async () => {
    await User.destroy({ truncate: true })
  })

  it('returns 404 when user not found', async () => {
    const response = await getUser()
    assert.equal(response.status, 404)
  })
  it('returns 200 when an active user exist', async () => {
    const user = await User.create(activeUser)
    const response = await getUser(user.id)
    assert.equal(response.status, 200)
  })
  it('returns id, username, email in response body when an active user exists', async () => {
    const user = await User.create(activeUser)
    const response = await getUser(user.id)
    assert.deepEqual(Object.keys(response.body), ['id', 'username', 'email'])
  })
  it('returns 404 when the user is inactive', async () => {
    const user = await User.create({ ...activeUser, inactive: true })
    const response = await getUser(user.id)
    assert.equal(response.status, 404)
  })
})
