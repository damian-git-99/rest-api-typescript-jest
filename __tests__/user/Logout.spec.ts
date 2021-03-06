import request from 'supertest';
import { app } from '../../src/app';
import { sequelize } from '../../src/config/database';
import { User } from '../../src/user/User';
import bcrypt from 'bcrypt';
import { Token } from '../../src/auth/Token';

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
  return request(app).post('/api/1.0/auth').send(credentials);
};

const logout = (options: { token?: string } = {}) => {
  const agent = request(app).delete('/api/1.0/logout');
  if (options.token) {
    agent.set('Authorization', `Bearer ${options.token}`);
  }
  return agent.send();
};

describe('Logout', () => {
  
  it('returns 200 ok when authorized request send for logout', async () => {
    await addUser();
    const response = await postAuthentication({
      email: 'user1@mail.com',
      password: 'P4ssword'
    });
    const token = response.body.token;
    await logout({ token: token });
    expect(response.status).toBe(200);
  });

  it('removes the token from database', async () => {
    await addUser();
    const response = await postAuthentication({
      email: 'user1@mail.com',
      password: 'P4ssword'
    });
    const token = response.body.token;
    await logout({ token: token });
    const storedToken = await Token.findOne({ where: { token: token } });
    expect(storedToken).toBeNull();
  });
});
