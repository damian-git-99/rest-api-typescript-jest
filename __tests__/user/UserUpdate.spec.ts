import request from 'supertest';
import { app } from '../../src/app';
import { User } from '../../src/user/User';
import { sequelize } from '../../src/config/database';
import bcrypt from 'bcrypt';

beforeAll(async () => {
  await sequelize.sync();
});

beforeEach(async () => {
  await User.destroy({ truncate: true });
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

const auth = async () => {
  const hashPassword = await bcrypt.hash(activeUser.password, 10);
  const user = await User.create({
    ...activeUser,
    password: hashPassword,
    email: 'damian2@mail.com'
  });
  const response = await request(app)
    .post('/api/1.0/auth')
    .send({ email: 'damian2@mail.com', password: activeUser.password });
  const token: string = response.body.token;
  return {
    token,
    id: user.id
  };
};

interface Options {
  token?: string;
}

const putUser = async (id = 5, body: any = null, options: Options = {}) => {
  const agent = request(app).put('/api/1.0/users/' + id);
  if (options.token) {
    agent.set('Authorization', `Bearer ${options.token}`);
  }
  return agent.send(body);
};

describe('User Update', () => {
  it('returns Unauthorized when request sent unauthorized', async () => {
    const response = await putUser();
    expect(response.status).toBe(403);
  });
  it('returns forbidden when update request is sent with correct credentials but for different user', async () => {
    const { token } = await auth();
    const userToBeUpdated = await addUser({
      ...activeUser,
      username: 'user2',
      email: 'user2@mail.com'
    });
    const response = await putUser(userToBeUpdated.id, null, { token });
    expect(response.status).toBe(403);
  });
  it('returns 200 ok when valid update request sent from authorized user', async () => {
    const { token, id } = await auth();
    const validUpdate = { username: 'user1-updated', password: 'P4ssword222' };
    const response = await putUser(id, validUpdate, { token });
    expect(response.status).toBe(200);
  });
  it('updates username in database when valid update request is sent from authorized user', async () => {
    const { token, id } = await auth();
    const validUpdate = { username: 'user1-updated' };
    await putUser(id, validUpdate, { token });

    const inDBUser = await User.findOne({ where: { id } });
    expect(inDBUser?.username).toBe(validUpdate.username);
  });
  it('returns 403 when token is not valid', async () => {
    const response = await putUser(5, null, { token: '123' });
    expect(response.status).toBe(403);
  });
  it('returns success body having only id, username, email', async () => {
    const { token, id } = await auth();
    const validUpdate = { username: 'user1-updated' };
    const response = await putUser(id, validUpdate, { token });
    expect(Object.keys(response.body)).toEqual(['id', 'username', 'email']);
  });
  it('returns 400 when email is already in use', async () => {
    await addUser({
      ...activeUser,
      username: 'user2',
      email: 'user2@mail.com'
    });
    const { token, id } = await auth();
    const validUpdate = { username: 'user1-updated', email: 'user2@mail.com' };
    const response = await putUser(id, validUpdate, { token });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('E-mail in use');
  });
});
