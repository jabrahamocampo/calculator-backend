import dotenv from 'dotenv';
import sequelize from './config/database.js';
import { seedOperations } from './config/seed.js';
import app from './app.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("FATAL: Missing JWT_SECRET");
}

const PORT = process.env.PORT || 4001;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    await sequelize.sync({ alter: true });
    console.log('Models synchronized');

    await seedOperations();
    console.log('Operations loaded');

    app.listen(PORT, () => {
      console.log(`Operation Service running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error connecting: ', err);
  }
}

startServer();
