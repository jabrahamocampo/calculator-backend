import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import operationRoutes from './routes/operation.routes.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//Routes
app.use('/api/v1/operations', operationRoutes);

//Base Route for validation
app.get('/', (req, res) => {
  res.send('Operation Service is running');
});

export default app;
