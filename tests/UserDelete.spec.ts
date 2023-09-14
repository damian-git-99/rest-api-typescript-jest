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

const auth = async () => {
  const hashPassword = await bcrypt.hash(activeUser.password, 10)
  const user = await User.create({
    ...activeUser,
    password: hashPassword,
    email: 'damian2@mail.com'
  })
  const response = await request(app)
    .post('/api/1.0/auth')
    .send({ email: 'damian2@mail.com', password: activeUser.password })
  const token: string = response.body.token
  return {
    token,
    id: user.id
  }
}

interface Options {
  token?: string
}

const deleteUser = async (id = 5, options: Options = {}) => {
  const agent = request(app).delete('/api/1.0/users/' + id)
  if (options.token) {
    agent.set('Authorization', `Bearer ${options.token}`)
  }
  return agent.send()
}

describe('User Delete', () => {
  before(async () => {
    await sequelize.sync()
  })

  beforeEach(async () => {
    await User.destroy({ truncate: true })
  })

  it('returns Unauthorized when request sent unauthorized', async () => {
    const response = await deleteUser()
    assert.equal(response.status, 403)
  })
  it('returns forbidden when delete request is sent with correct credentials but for different user', async () => {
    const userToBeDelete = await addUser({
      ...activeUser,
      username: 'user2',
      email: 'user2@mail.com'
    })
    const { token } = await auth()
    const response = await deleteUser(userToBeDelete.id, { token: token })
    assert.equal(response.status, 403)
  })
  it('returns 403 when token is not valid', async () => {
    const response = await deleteUser(5, { token: '123' })
    assert.equal(response.status, 403)
  })
  it('returns 200 ok when delete request sent from authorized user', async () => {
    const { token, id } = await auth()
    const response = await deleteUser(id, { token: token })
    assert.equal(response.status, 200)
  })
  it('deletes user from database when request sent from authorized user', async () => {
    const { token, id } = await auth()
    await deleteUser(id, { token: token })

    const inDBUser = await User.findOne({ where: { id } })
    assert.equal(inDBUser, null)
  })
  it('deletes token from database when delete user request sent from authorized user', async () => {
    const { token, id } = await auth()
    await deleteUser(id, { token: token })

    const tokenInDB = await Token.findOne({ where: { token } })
    assert.equal(tokenInDB, null)
  })
})
