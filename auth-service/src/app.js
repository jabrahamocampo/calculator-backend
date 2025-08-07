import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/', authRoutes);

// Route base
app.get('/', (req, res) => {
  res.send('Auth Service is running');
});

export default app;
