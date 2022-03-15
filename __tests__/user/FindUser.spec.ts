import request from 'supertest';
import { app } from '../../src/app';
import { User } from '../../src/user/User';
import { sequelize } from '../../src/config/database';
import bcrypt from 'bcrypt';

beforeAll(async () => {
  try {
    await sequelize.sync();
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
  email: 'damian@mail.com',
  password: 'P4ssword',
  inactive: false
};

const getUser = async (id = 100) => {
  const token = await auth();
  return request(app)
    .get('/api/1.0/users/' + id)
    .set('Authorization', `Bearer ${token}`)
    .send();
};

const auth = async () => {
  const hashPassword = await bcrypt.hash(activeUser.password, 10);
  await User.create({
    ...activeUser,
    password: hashPassword,
    email: 'damian2@mail.com'
  });
  const response = await request(app)
    .post('/api/1.0/auth')
    .send({ email: 'damian2@mail.com', password: activeUser.password });
  const token: string = response.body.token;
  return token;
};

describe('Get User', () => {
  it('returns 404 when user not found', async () => {
    const response = await getUser();
    expect(response.status).toBe(404);
  });
  it('returns 200 when an active user exist', async () => {
    const user = await User.create(activeUser);
    const response = await getUser(user.id);
    expect(response.status).toBe(200);
  });
  it('returns id, username, email in response body when an active user existt', async () => {
    const user = await User.create(activeUser);
    const response = await getUser(user.id);
    expect(Object.keys(response.body)).toEqual(['id', 'username', 'email']);
  });
  it('returns 404 when the user is inactive', async () => {
    const user = await User.create({ ...activeUser, inactive: true });
    const response = await getUser(user.id);
    expect(response.status).toBe(404);
  });
});
