
import sequelize from './config/database.js';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("FATAL: Missing JWT_SECRET");
}

const PORT = process.env.PORT || 4002;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connecting to Data Base');
    await sequelize.sync({ alter: true });
    console.log('Models sinchronized');

    app.listen(PORT, () => {
      console.log(`Record Service listenuing on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error Connection:', err);
  }
}

startServer();
