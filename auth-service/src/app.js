import express from 'express';
//import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middlewares
//app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/', authRoutes);

// Base Route for health check
app.get('/', (req, res) => {
  res.send('Auth Service is running');
});

export default app;
