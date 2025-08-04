import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'https://calculator-frontend-ten.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));

const PORT = process.env.PORT || 8080;

// Rutas y redirecciones
app.use('/api/v1/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE,
  changeOrigin: true,
}));

app.use('/api/v1/operations', createProxyMiddleware({
  target: process.env.OPERATION_SERVICE,
  changeOrigin: true,
}));

app.use('/api/v1/records', createProxyMiddleware({
  target: process.env.RECORD_SERVICE,
  changeOrigin: true,
}));

app.use('/api/v1/balance', createProxyMiddleware({
  target: process.env.BALANCE_SERVICE,
  changeOrigin: true,
}));

app.use(express.json());

// Ruta base
app.get('/', (req, res) => {
  res.send('API Gateway funcionando');
});

app.listen(PORT, () => {
  console.log(`API Gateway escuchando en http://localhost:${PORT}`);
});

