import express from 'express';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();
const app = express();

// ====== CORS ======
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
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// ====== Variables de entorno desde Service Links ======
const PORT = process.env.PORT || 8080;
const AUTH_SERVICE = process.env.AUTH_SERVICE; // URL interna de Render
const OPERATION_SERVICE = process.env.OPERATION_SERVICE;
const RECORD_SERVICE = process.env.RECORD_SERVICE;
const BALANCE_SERVICE = process.env.BALANCE_SERVICE;

console.log("🌍 Variables de entorno:");
console.log("AUTH_SERVICE =", AUTH_SERVICE);
console.log("OPERATION_SERVICE =", OPERATION_SERVICE);
console.log("RECORD_SERVICE =", RECORD_SERVICE);
console.log("BALANCE_SERVICE =", BALANCE_SERVICE);

// ====== Proxy con logs ======
app.use('/api/v1/auth', createProxyMiddleware({
  target: AUTH_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/v1/auth': '' }, // <---- IMPORTANTE
  onProxyReq: (proxyReq, req) => {
    console.log(`🚀 [Gateway -> Auth Service] ${req.method} ${req.originalUrl} -> ${AUTH_SERVICE}${req.originalUrl}`);
    console.log(`🔹 Headers enviados:`, req.headers);
    console.log(`🔹 Body enviado:`, req.body);

    if (req.body && Object.keys(req.body).length) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error(`❌ Error en el proxy hacia Auth Service:`, err.message);
    res.status(500).send('Error en el API Gateway');
  }
}));

// ====== Otros proxys ======
app.use('/api/v1/operations', createProxyMiddleware({
  target: OPERATION_SERVICE,
  changeOrigin: true
}));
app.use('/api/v1/records', createProxyMiddleware({
  target: RECORD_SERVICE,
  changeOrigin: true
}));
app.use('/api/v1/balance', createProxyMiddleware({
  target: BALANCE_SERVICE,
  changeOrigin: true
}));

app.get('/', (req, res) => {
  res.send('✅ API Gateway funcionando');
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway escuchando en http://localhost:${PORT}`);
});
