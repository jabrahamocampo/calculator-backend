import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// Rutas con prefijo unificado
app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Auth Service is running');
});

export default app;
