import express from 'express';
import morgan from 'morgan';
import recordRoutes from './routes/record.routes.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/', recordRoutes);

// Base Route for validation
app.get('/', (req, res) => {
  res.send('Record Service is running');
});

export default app;
