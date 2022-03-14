import request from 'supertest';
import { app } from '../../src/app';
import { sequelize } from '../../src/config/database';
import { User } from '../../src/user/User';

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

interface ValidUser {
  username?: string;
  password?: string;
  email?: string;
  inactive?: boolean;
}

const validUser: ValidUser = {
  username: 'user1',
  email: 'user1@mail.com',
  password: 'P4ssword'
};

const postUser = (user = { ...validUser }) => {
  return request(app)
    .post('/api/1.0/users')
    .send(user);
};

describe('User Registration', () => {
  it('returns 200 ok when signup request is valid', async () => {
    const response = await postUser();
    expect(response.status).toBe(200);
  });

  it('returns success message when signup request is valid', async () => {
    const response = await postUser();
    expect(response.body.message).toBe('User Created');
  });

  it('saves the user to database', async () => {
    await postUser();
    const users = await User.findAll();
    // query user table
    expect(users.length).toBe(1);
  });

  it('saves the username and email to database', async () => {
    await postUser();
    const users = await User.findAll();
    const user = users[0];
    expect(user.username).toBe('user1');
    expect(user.email).toBe('user1@mail.com');
  });

  it('encrypt the password in database', async () => {
    await postUser();
    const users = await User.findAll();
    const user = users[0];
    expect(user.password).not.toBe('P4ssword');
  });

  it('returns 400 when username is null', async () => {
    const response = await postUser({
      username: undefined,
      email: 'user1@mail.com',
      password: '123456'
    });

    expect(response.status).toBe(400);
  });

  it('returns 400 when email is null', async () => {
    const response = await postUser({
      username: 'user1',
      email: undefined,
      password: '123456'
    });

    expect(response.status).toBe(400);
  });

  it('returns 400 when password is null', async () => {
    const response = await postUser({
      username: 'user1',
      email: 'user1@mail.com',
      password: undefined
    });

    expect(response.status).toBe(400);
  });

  it('returns E-mail in use when same email is already in use', async () => {
    await User.create({
      username: 'damian',
      email: 'damian@gmail.com',
      password: 'P4ssword'
    });
    const response = await postUser({
      ...validUser,
      email: 'damian@gmail.com'
    });
    expect(response.body.validationErrors.email).toBe('E-mail in use');
  });

  it('returns validationErrors field in response body when validation error ocurs', async () => {
    const response = await postUser({
      username: undefined,
      email: 'user1@mail.com',
      password: '123456'
    });

    const body = response.body;
    expect(body.validationErrors).not.toBeUndefined();
  });

  it('returns errors for both username is null and email is null', async () => {
    const response = await postUser({
      username: undefined,
      email: undefined,
      password: 'P4ssword'
    });

    const body = response.body;
    expect(Object.keys(body.validationErrors)).toEqual(['username', 'email']);
  });

  it.each`
    field         | value              | expectedMessage
    ${'username'} | ${null}            | ${'Username cannot be null'}
    ${'username'} | ${'usr'}           | ${'Must have min 4 and max 32 characters'}
    ${'username'} | ${'a'.repeat(33)}  | ${'Must have min 4 and max 32 characters'}
    ${'email'}    | ${null}            | ${'E-mail cannot be null'}
    ${'email'}    | ${'mail.com'}      | ${'E-mail is not valid'}
    ${'email'}    | ${'user.mail.com'} | ${'E-mail is not valid'}
    ${'email'}    | ${'user@mail'}     | ${'E-mail is not valid'}
    ${'password'} | ${null}            | ${'Password cannot be null'}
    ${'password'} | ${'P4ssw'}         | ${'Password must be at least 6 characters'}
    ${'password'} | ${'alllowercase'}  | ${'Password must have at least 1 uppercase, 1 lowercase letter and 1 number'}
    ${'password'} | ${'ALLUPPERCASE'}  | ${'Password must have at least 1 uppercase, 1 lowercase letter and 1 number'}
    ${'password'} | ${'1234567890'}    | ${'Password must have at least 1 uppercase, 1 lowercase letter and 1 number'}
    ${'password'} | ${'lowerandUPPER'} | ${'Password must have at least 1 uppercase, 1 lowercase letter and 1 number'}
    ${'password'} | ${'lower4nd5667'}  | ${'Password must have at least 1 uppercase, 1 lowercase letter and 1 number'}
    ${'password'} | ${'UPPER44444'}    | ${'Password must have at least 1 uppercase, 1 lowercase letter and 1 number'}
  `(
    'returns $expectedMessage when $field is $value',
    async ({
      field,
      expectedMessage,
      value
    }: {
      field: string;
      expectedMessage: string;
      value: string;
    }) => {
      const user: { [key: string]: string | null } = {
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword'
      };
      user[field] = value;
      const response = await postUser(user);
      const body = response.body;
      expect(body.validationErrors[field]).toBe(expectedMessage);
    }
  );
});
