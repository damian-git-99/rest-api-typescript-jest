import { Sequelize } from 'sequelize'
import config from 'config'

const dbConfig: {
  dialect: any
  logging: any
  uri: string
} = config.get('database')

export const sequelize = new Sequelize(dbConfig.uri, {
  dialect: dbConfig.dialect,
  logging: dbConfig.logging
})

export const connectDB = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: true })
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }
}
