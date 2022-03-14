import { User } from './User';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

class UserService {
  async signIn(user: User) {
    const password = bcrypt.hashSync(user.password, 10);
    await User.create({ ...user, password });
  }

  async findByEmail(email: string) {
    const user = await User.findOne({ where: { email } });
    return user;
  }

  async getUsers(authenticatedUser?: number) {
    const users = await User.findAll({
      where: {
        inactive: false,
        id: {
          // https://sequelize.org/master/manual/model-querying-basics.html#operators
          [Op.not]: authenticatedUser ? authenticatedUser : 0 // select * where attribute is NOT x, Op = operator
        }
      },
      attributes: ['id', 'username', 'email'],
    });
    return users;
  }
}

const userService = new UserService();
export default userService;
