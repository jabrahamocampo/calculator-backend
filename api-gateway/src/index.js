import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();

// ====== Configuración CORS global ======
const allowedOrigins = [
  'http://localhost:5173', // desarrollo
  'https://calculator-frontend-ten.vercel.app' // producción Vercel
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Responde rápido a preflight
  }
  next();
});

app.use(express.json());

// ====== Variables de entorno ======
const PORT = process.env.PORT || 8080;
const AUTH_SERVICE = process.env.AUTH_SERVICE;
const OPERATION_SERVICE = process.env.OPERATION_SERVICE;
const RECORD_SERVICE = process.env.RECORD_SERVICE;
const BALANCE_SERVICE = process.env.BALANCE_SERVICE;

// ====== Proxies ======
app.use('/api/v1/auth', createProxyMiddleware({
  target: AUTH_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/auth': '' }
}));

app.use('/api/v1/operations', createProxyMiddleware({
  target: OPERATION_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/operations': '' }
}));

app.use('/api/v1/records', createProxyMiddleware({
  target: RECORD_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/records': '' }
}));

app.use('/api/v1/balance', createProxyMiddleware({
  target: BALANCE_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/balance': '' }
}));

// Ruta base
app.get('/', (req, res) => {
  res.send('API Gateway funcionando');
});

app.listen(PORT, () => {
  console.log(`API Gateway escuchando en http://localhost:${PORT}`);
});
