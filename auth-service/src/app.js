import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import errorHandler from "./middlewares/errorHandler.js";
import client from 'prom-client';
import sequelize from './config/database.js';

const app = express();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'UP', db: 'UP' });
  } catch (error) {
    res.status(500).json({ status: 'DOWN', db: 'DOWN', error: error.message });
  }
});

app.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'];
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  next();
});

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/', authRoutes);

// Route base
app.get('/', (req, res) => {
  res.send('Auth Service is running');
});

// Middleware of errors
app.use(errorHandler);

export default app;
