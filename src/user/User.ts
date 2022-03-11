import { DataTypes, Model, InferAttributes, InferCreationAttributes ,CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id?: CreationOptional<number>;
  declare username: string;
  declare email: string;
  declare password: string;
  declare inactive?: boolean;
}

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
    }
  },
  {
    sequelize,
    modelName: 'user'
  }
);
