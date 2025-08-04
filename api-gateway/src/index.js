import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173', // para desarrollo local
  'https://calculator-frontend-ten.vercel.app' // tu frontend en producción
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 8080;

//Proxy Routes
app.use('/api/v1/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE,
  changeOrigin: true
}));

app.use('/api/v1/operations', createProxyMiddleware({
  target: process.env.OPERATION_SERVICE,
  changeOrigin: true
}));

app.use('/api/v1/records', createProxyMiddleware({
  target: process.env.RECORD_SERVICE,
  changeOrigin: true
}));

app.use('/api/v1/balance', createProxyMiddleware({
  target: process.env.BALANCE_SERVICE,
  changeOrigin: true
}));

// Ruta base
app.get('/', (req, res) => {
  res.send('API Gateway funcionando');
});

app.listen(PORT, () => {
  console.log(`API Gateway escuchando en http://localhost:${PORT}`);
});
