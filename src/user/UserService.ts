import { User } from './User';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { UserNotFoundException } from './exceptions/UserNotFoundException';

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
      attributes: ['id', 'username', 'email']
    });
    return users;
  }

  async getUser(id: number) {
    const user = await User.findOne({
      where: {
        id: id,
        inactive: false
      },
      attributes: ['id', 'username', 'email']
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async deleteUserById(id: number) {
    await User.destroy({ where: { id } });
  }
}

const userService = new UserService();
export default userService;
