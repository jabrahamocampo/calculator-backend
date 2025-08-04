import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/database.js';
import Operation from './models/Operation.js';
import { seedOperations } from './config/seed.js';
import operationRoutes from './routes/operation.routes.js';
import app from './app.js';

dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/', operationRoutes);

const PORT = process.env.PORT || 4001;

app.get('/', (req, res) => {
  res.send('Operation Service running...');
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connecctin to Data Base');
    await sequelize.sync({ alter: true });
    console.log('Synchronized Models');
    await seedOperations();
    console.log('Loading Operations');

    app.listen(PORT, () => {
      console.log(`Operation Service listen on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error connecting: ', err);
  }
}

startServer();
