import express from 'express';
import morgan from 'morgan';
import recordRoutes from './routes/record.routes.js';
import errorHandler from "./middlewares/errorHandler.js";
import client from 'prom-client';
import sequelize from './config/database.js';

const app = express();

app.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'];
  const userId = req.headers['x-user-id'] || 'anonymous';
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  console.log(`[${correlationId}] [User:${userId}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'UP', db: 'UP' });
  } catch (error) {
    res.status(500).json({ status: 'DOWN', db: 'DOWN', error: error.message });
  }
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});


// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/', recordRoutes);

// Base Route for validation
app.get('/', (req, res) => {
  res.send('Record Service is running');
});

// Middleware of errors
app.use(errorHandler);

export default app;
