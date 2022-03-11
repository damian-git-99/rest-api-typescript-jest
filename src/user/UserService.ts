import { User } from './User';
import bcrypt from 'bcrypt';

class UserService {
  async signIn(user: User) {
    const password = bcrypt.hashSync(user.password, 10);
    await User.create({ ...user, password });
  }

  async findByEmail(email: string) {
    const user = await User.findOne({ where: { email } });
    return user;
  }
}

const userService = new UserService();
export default userService;
