import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
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
    console.error('[HEALTH] sequelize.authenticate error:', error);
    res.status(500).json({ status: 'DOWN', db: 'DOWN', error: error.message });
  }
});

// Correlation middleware
app.use((req, res, next) => {
  try {
    const correlationId = req.headers['x-correlation-id'] || `cid-${Date.now()}`;
    req.correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);
    next();
  } catch (err) {
    next(err);
  }
});

app.use(express.json());
app.use(morgan('dev'));

// === Routes: mount auth under /auth (recommended) ===
app.use('/auth', authRoutes);

// Keep a simple base route that never depends on DB or other services
app.get('/', (req, res) => {
  // defensive try/catch just to log
  try {
    res.send('Auth Service is running');
  } catch (err) {
    console.error('[BASE /] unexpected error:', err);
    throw err;
  }
});

// Error handler (keeps the same behavior but logs stack in dev)
app.use(errorHandler);

// Unhandled rejections / exceptions => log (helps debugging)
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

export default app;
