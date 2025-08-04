import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import balanceRoutes from './routes/balance.routes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/', balanceRoutes);

// Base Route for validation
app.get('/', (req, res) => {
  res.send('Balance Service is running');
});

export default app;
