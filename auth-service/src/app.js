import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// Logs globales para depuración
app.use((req, res, next) => {
  console.log(`📥 [Auth Service] ${req.method} ${req.originalUrl}`);
  console.log(`🔹 Headers:`, req.headers);
  console.log(`🔹 Body:`, req.body);
  next();
});

// Rutas
//app.use('/', authRoutes);
app.use('/api/v1/auth', authRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('Auth Service is running');
});

export default app;
