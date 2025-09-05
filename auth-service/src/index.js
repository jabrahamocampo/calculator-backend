import dotenv from 'dotenv';
import sequelize, { syncDatabase } from './config/database.js';
import app from './app.js';
import IdempotencyKey from './models/IdempotencyKey.js';
import User from './models/User.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("FATAL: Missing JWT_SECRET");
}

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Validate DB connection
    await sequelize.authenticate();
    console.log('Connection to the database established successfully.');

    // Synchronize all models
    await syncDatabase();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Auth Service listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start Auth Service:', error);
    process.exit(1);
  }
}

startServer();
