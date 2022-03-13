import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../config/database';
import { User } from '../user/User';

export class Token extends Model<InferAttributes<Token>, InferCreationAttributes<Token>> {
  declare token: string;
  declare lastUsedAt: Date;
  declare userId: CreationOptional<number>;
  declare user?: NonAttribute<User>;
}

Token.init(
  {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lastUsedAt: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    modelName: 'token',
    timestamps: false
  }
);


