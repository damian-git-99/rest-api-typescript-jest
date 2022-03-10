import { Sequelize } from 'sequelize';
import config from 'config';

const dbConfig: {
  database: string;
  username: string;
  password: string;
  dialect: any;
  storage: string;
  logging: any;
} = config.get('database');

export const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  logging: dbConfig.logging
});

export const connectDB = async() => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}
