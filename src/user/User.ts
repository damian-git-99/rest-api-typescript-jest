import { DataTypes, Model, InferAttributes, InferCreationAttributes ,CreationOptional, HasManyGetAssociationsMixin } from 'sequelize';
import { sequelize } from '../config/database';
import { Token } from '../auth/Token';

export class User extends Model<InferAttributes<User, {omit: 'tokens'}>, InferCreationAttributes<User>> {
  declare id?: CreationOptional<number>;
  declare username: string;
  declare email: string;
  declare password: string;
  declare inactive?: boolean;
  declare tokens? : HasManyGetAssociationsMixin<Token>;
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
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'user'
  }
);

// associations
User.hasMany(Token, { onDelete: 'cascade', foreignKey: 'userId', sourceKey: 'id'});
Token.belongsTo(User, { targetKey: 'id' , foreignKey: 'userId'});