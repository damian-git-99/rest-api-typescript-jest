import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface UserInterface {
  id?: number;
  username: string;
  email: string;
  password: string;
  inactive?: boolean;
  activationToken?: string;
}

export class User extends Model<UserInterface> {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING
    },
    inactive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    activationToken: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize,
    modelName: 'user'
  }
);
