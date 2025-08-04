import dotenv from 'dotenv';
import sequelize from './config/database.js';
import app from './app.js';

dotenv.config();
const PORT = process.env.PORT || 4000;

// Test DB connection and start the server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database established successfully.');

    await sequelize.sync({ alter: true });
    console.log('Models synchronized with the database.');

    app.listen(PORT, () => {
      console.log(`Auth Service listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Could not connect to the database:', error);
    process.exit(1);
  }
}

startServer();
