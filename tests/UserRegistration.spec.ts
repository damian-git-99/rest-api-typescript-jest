import { describe, it, before, beforeEach } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { sequelize } from '../src/config/database'
import { User } from '../src/user/User'
import { app } from '../src/app'

interface ValidUser {
  username?: string
  password?: string
  email?: string
  inactive?: boolean
}

const validUser: ValidUser = {
  username: 'user1',
  email: 'user1@mail.com',
  password: 'P4ssword'
}

const postUser = (user = { ...validUser }) => {
  return request(app).post('/api/1.0/users').send(user)
}

describe('User Registration', () => {
  before(async () => {
    await sequelize.sync()
  })

  beforeEach(async () => {
    await User.destroy({ truncate: true })
  })

  it('returns 200 ok when signup request is valid', async () => {
    const response = await postUser()
    assert.equal(response.status, 200)
  })

  it('returns success message when signup request is valid', async () => {
    const response = await postUser()
    assert.equal(response.body.message, 'User Created')
  })

  it('saves the user to database', async () => {
    await postUser()
    const users = await User.findAll()
    // query user table
    assert.equal(users.length, 1)
  })

  it('saves the username and email to database', async () => {
    await postUser()
    const users = await User.findAll()
    const user = users[0]
    assert.equal(user.username, 'user1')
    assert.equal(user.email, 'user1@mail.com')
  })

  it('encrypt the password in database', async () => {
    await postUser()
    const users = await User.findAll()
    const user = users[0]
    assert.notEqual(user.password, 'P4ssword')
  })

  it('returns 400 when username is null', async () => {
    const response = await postUser({
      username: undefined,
      email: 'user1@mail.com',
      password: '123456'
    })

    assert.equal(response.status, 400)
  })

  it('returns 400 when email is null', async () => {
    const response = await postUser({
      username: 'user1',
      email: undefined,
      password: '123456'
    })

    assert.equal(response.status, 400)
  })

  it('returns 400 when password is null', async () => {
    const response = await postUser({
      username: 'user1',
      email: 'user1@mail.com',
      password: undefined
    })

    assert.equal(response.status, 400)
  })

  it('returns E-mail in use when same email is already in use', async () => {
    await User.create({
      username: 'damian',
      email: 'damian@gmail.com',
      password: 'P4ssword'
    })
    const response = await postUser({
      ...validUser,
      email: 'damian@gmail.com'
    })
    assert.equal(response.body.validationErrors.email, 'E-mail in use')
  })

  it('returns validationErrors field in response body when validation error ocurs', async () => {
    const response = await postUser({
      username: undefined,
      email: 'user1@mail.com',
      password: '123456'
    })

    const body = response.body
    assert.notEqual(body.validationErrors, undefined)
  })

  it('returns errors for both username is null and email is null', async () => {
    const response = await postUser({
      username: undefined,
      email: undefined,
      password: 'P4ssword'
    })

    const body = response.body
    assert.deepEqual(Object.keys(body.validationErrors), ['username', 'email'])
  })

  it('Username cannot be null', async () => {
    const user = {
      username: undefined,
      email: 'user1@mail.com',
      password: 'P4ssword'
    }
    const response = await postUser(user)
    const body = response.body
    assert.equal(body.validationErrors.username, 'Username cannot be null')
  })

  it('Username must have at least 4 and at most 32 characters', async () => {
    const user = {
      username: 'usr',
      email: 'user1@mail.com',
      password: 'P4ssword'
    }
    const response = await postUser(user)
    const body = response.body
    assert.equal(
      body.validationErrors.username,
      'Must have min 4 and max 32 characters'
    )
  })

  it('E-mail cannot be null', async () => {
    const user = {
      username: 'user1',
      email: undefined,
      password: 'P4ssword'
    }
    const response = await postUser(user)
    const body = response.body
    assert.equal(body.validationErrors.email, 'E-mail cannot be null')
  })

  it('E-mail is not valid', async () => {
    const user = {
      username: 'user1',
      email: 'mail.com',
      password: 'P4ssword'
    }
    const response = await postUser(user)
    const body = response.body
    assert.equal(body.validationErrors.email, 'E-mail is not valid')
  })

  it('Password cannot be null', async () => {
    const user = {
      username: 'user1',
      email: 'user1@mail.com',
      password: undefined
    }
    const response = await postUser(user)
    const body = response.body
    assert.equal(body.validationErrors.password, 'Password cannot be null')
  })

  it('Password must be at least 6 characters', async () => {
    const user = {
      username: 'user1',
      email: 'user1@mail.com',
      password: 'P4ss'
    }
    const response = await postUser(user)
    const body = response.body
    assert.equal(
      body.validationErrors.password,
      'Password must be at least 6 characters'
    )
  })
})
