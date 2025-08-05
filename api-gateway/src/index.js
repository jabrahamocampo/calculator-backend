import express from 'express';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();

// ====== Configuración CORS ======
const allowedOrigins = [
  'http://localhost:5173',
  'https://calculator-frontend-ten.vercel.app'
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
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

const PORT = process.env.PORT || 8080;

// ====== Proxies ======
app.use('/api/v1/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/auth': '' } // Quita el prefijo antes de enviar al microservicio
}));

app.use('/api/v1/operations', createProxyMiddleware({
  target: process.env.OPERATION_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/operations': '' }
}));

app.use('/api/v1/records', createProxyMiddleware({
  target: process.env.RECORD_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/records': '' }
}));

app.use('/api/v1/balance', createProxyMiddleware({
  target: process.env.BALANCE_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/balance': '' }
}));

// Ruta base
app.get('/', (req, res) => {
  res.send('✅ API Gateway funcionando');
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway escuchando en http://localhost:${PORT}`);
});
