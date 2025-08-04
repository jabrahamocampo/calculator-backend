import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false, 
  }
);

export async function syncDatabase() {
  if (process.env.NODE_ENV === 'test') {
    await sequelize.sync({ force: true }); // Warning: This removes all data from table, use just for dev/test env.
  } else {
    await sequelize.sync(); // Note: This validation is to avoid remove data in procution table.
  }
}


export default sequelize;