import { describe, it, before, beforeEach } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { sequelize } from '../src/config/database'
import { User } from '../src/user/User'
import { app } from '../src/app'
import bcrypt from 'bcrypt'

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

describe('Log in', () => {
  before(async () => await sequelize.sync())
  beforeEach(async () => {
    await User.destroy({ truncate: true })
  })
  it('returns 200 when credentials are correct', async () => {
    await addUser()
    const response = await postAuthentication({
      email: 'user1@mail.com',
      password: 'P4ssword'
    })
    assert.equal(response.status, 200)
  })

  it('returns user id, username and token when login success', async () => {
    const user = await addUser()
    const response = await postAuthentication({
      email: 'user1@mail.com',
      password: 'P4ssword'
    })
    assert.equal(response.body.id, user.id)
    assert.equal(response.body.username, user.username)
    assert.deepEqual(Object.keys(response.body), ['id', 'username', 'token'])
  })

  it('returns 401 when user does not exist', async () => {
    const response = await postAuthentication({
      email: 'user1@mail.com',
      password: 'P4ssword'
    })
    assert.equal(response.status, 401)
  })

  it('returns 401 when password is wrong', async () => {
    await addUser()
    const response = await postAuthentication({
      email: 'user1@mail.com',
      password: 'password'
    })
    assert.equal(response.status, 401)
  })

  it('returns 403 when logging in with an inactive account', async () => {
    await addUser({ ...activeUser, inactive: true })
    const response = await postAuthentication({
      email: 'user1@mail.com',
      password: 'P4ssword'
    })
    assert.equal(response.status, 403)
  })

  it('returns 400 when e-mail is not present', async () => {
    const response = await postAuthentication({ password: 'P4ssword' })
    assert.equal(response.status, 400)
  })

  it('returns 400 when password is not present', async () => {
    const response = await postAuthentication({ email: 'user1@mail.com' })
    assert.equal(response.status, 400)
  })

  it('returns 401 when password or email are not correct', async () => {
    const response = await postAuthentication({
      email: 'emalifalso@gmail.com',
      password: 'P4ssword2'
    })
    assert.equal(response.status, 401)
  })

  it('returns token in response body when credentials are correct', async () => {
    await addUser()
    const response = await postAuthentication({
      email: 'user1@mail.com',
      password: 'P4ssword'
    })
    // expect(response.body.token).not.toBeUndefined()
    assert.notEqual(response.body.token, undefined)
  })
})
