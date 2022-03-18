import { User } from './User';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { UserNotFoundException } from './exceptions/UserNotFoundException';
import { EmailInUseException } from './exceptions/EmailInUseException';

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
          [Op.not]: authenticatedUser ? authenticatedUser : 0
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

  async updateUser(id: number, updatedBody: User) {
    const user = await User.findOne({ where: { id } });
    if (!user) throw new UserNotFoundException();
    
    user.username = updatedBody.username ? updatedBody.username : user.username;
    user.password = updatedBody.password ? bcrypt.hashSync(updatedBody.password, 10) : user.password;
    if (updatedBody.email) {
      const existsInDB = await this.findByEmail(updatedBody.email);
      if (existsInDB && updatedBody.email !== user.email ) throw new EmailInUseException();
      user.email = updatedBody.email;
    }
    await user.save();
    return {
      id: id,
      username: user.username,
      email: user.email,
    };
  }
}

const userService = new UserService();
export default userService;
