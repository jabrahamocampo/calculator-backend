import express from 'express';
import morgan from 'morgan';
import recordRoutes from './routes/record.routes.js';
import errorHandler from "./middlewares/errorHandler.js";
import client from 'prom-client';
import sequelize from './config/database.js';

const app = express();

// Request logger (very early)
app.use((req, res, next) => {
  console.log(`[REQ] ${new Date().toISOString()} ${req.method} ${req.originalUrl} headers:`, {
    'x-correlation-id': req.headers['x-correlation-id'],
    'x-user-id': req.headers['x-user-id'],
    authorization: !!req.headers['authorization'],
    'content-type': req.headers['content-type'],
  });
  next();
});

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
  try{
    const correlationId = req.headers['x-correlation-id'] || `cid-${Date.now()}`;
    const userId = req.headers['x-user-id'] || 'anonymous';
    req.correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);
    console.log(`[${correlationId}] [User:${userId}] ${req.method} ${req.originalUrl}`);
    next();
  } catch (err) {
    next(err);
  }
});

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/records', recordRoutes);

app.get('/', (req, res) => {
  // defensive try/catch just to log
  try {
    res.send('Record Service is running');
  } catch (err) {
    console.error('[BASE /] unexpected error:', err);
    throw err;
  }
});

// Middleware of errors
app.use(errorHandler);

// Unhandled rejections / exceptions => log (helps debugging)
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

export default app;
