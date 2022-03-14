import request from 'supertest';
import { app } from '../../src/app';
import { sequelize } from '../../src/config/database';
import { User } from '../../src/user/User';
import bcrypt from 'bcrypt';

beforeAll(async () => {
  try {
    await sequelize.sync();
    jest.setTimeout(20000);
  } catch (error) {
    console.log(error);
  }
});

beforeEach(async () => {
  try {
    await User.destroy({ truncate: true });
  } catch (error) {
    console.log(error);
  }
});

const activeUser = {
  username: 'user1',
  email: 'user1@mail.com',
  password: 'P4ssword',
  inactive: false
};

const addUser = async (user = { ...activeUser }) => {
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  return await User.create(user);
};

const postAuthentication = (credentials = {}) => {
  return request(app)
    .post('/api/1.0/auth')
    .send(credentials);
};

describe('Log in', () => {
  it('returns 200 when credentials are correct', async () => {
    await addUser();
    const response = await postAuthentication({
      email: 'user1@mail.com',
      password: 'P4ssword'
    });
    expect(response.status).toBe(200);
  });

  it('returns user id, username and token when login success', async () => {
    const user = await addUser();
    const response = await postAuthentication({
      email: 'user1@mail.com',
      password: 'P4ssword'
    });
    expect(response.body.id).toBe(user.id);
    expect(response.body.username).toBe(user.username);
    expect(Object.keys(response.body)).toEqual(['id', 'username', 'token']);
  });

  it('returns 401 when user does not exist', async () => {
    const response = await postAuthentication({
      email: 'user1@mail.com',
      password: 'P4ssword'
    });
    expect(response.status).toBe(401);
  });

  it('returns 401 when password is wrong', async () => {
    await addUser();
    const response = await postAuthentication({
      email: 'user1@mail.com',
      password: 'password'
    });
    expect(response.status).toBe(401);
  });

  it('returns 403 when logging in with an inactive account', async () => {
    await addUser({ ...activeUser, inactive: true });
    const response = await postAuthentication({
      email: 'user1@mail.com',
      password: 'P4ssword'
    });
    expect(response.status).toBe(403);
  });

  it('returns 400 when e-mail is not present', async () => {
    const response = await postAuthentication({ password: 'P4ssword' });
    expect(response.status).toBe(400);
  });

  it('returns 400 when password is not present', async () => {
    const response = await postAuthentication({ email: 'user1@mail.com' });
    expect(response.status).toBe(400);
  });

  it('returns 401 when password or email are not correct', async () => {
    const response = await postAuthentication({
      email: 'emalifalso@gmail.com',
      password: 'P4ssword2'
    });
    expect(response.status).toBe(401);
  });

  it('returns token in response body when credentials are correct', async () => {
    await addUser();
    const response = await postAuthentication({
      email: 'user1@mail.com',
      password: 'P4ssword'
    });
    expect(response.body.token).not.toBeUndefined();
  });
});
