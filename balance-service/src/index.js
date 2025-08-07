import dotenv from 'dotenv';
import sequelize from './config/database.js';
import app from './app.js';

dotenv.config();
const PORT = process.env.PORT || 4003;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connecting to Data Base');
    await sequelize.sync({ alter: true });
    console.log('Models Sinchronized');

    app.listen(PORT, () => {
      console.log(`Balance Service listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error connecting Data Base:', err);
  }
}

startServer();
