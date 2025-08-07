import dotenv from 'dotenv';
import sequelize from './config/database.js';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database established successfully.');

    await sequelize.sync({ alter: true });
    console.log('Models synchronized with the database.');

    app.listen(PORT, () => {
      console.log(`Auth Service listen on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Connection to data base not success', error);
    process.exit(1);
  }
}

startServer();
