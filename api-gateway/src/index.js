import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// ====== Variables de entorno ======
const AUTH_SERVICE = process.env.AUTH_SERVICE; 
const OPERATION_SERVICE = process.env.OPERATION_SERVICE;
const RECORD_SERVICE = process.env.RECORD_SERVICE;
const BALANCE_SERVICE = process.env.BALANCE_SERVICE;

console.log("🌍 Servicios configurados:");
console.log("   AUTH_SERVICE =", AUTH_SERVICE);
console.log("   OPERATION_SERVICE =", OPERATION_SERVICE);
console.log("   RECORD_SERVICE =", RECORD_SERVICE);
console.log("   BALANCE_SERVICE =", BALANCE_SERVICE);

// ====== Función auxiliar para requests internos ======
async function forwardRequest(serviceUrl, method, path, req, res) {
  try {
    console.log(`🚀 API Gateway -> ${serviceUrl}${path}`);
    const response = await axios({
      method,
      url: `${serviceUrl}${path}`,
      data: req.body,
      params: req.query,
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(`❌ Error comunicando con ${serviceUrl}:`, err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Error en API Gateway' });
  }
}

// ====== Rutas Auth Service ======
app.post('/api/v1/auth/register', (req, res) => forwardRequest(AUTH_SERVICE, 'post', '/register', req, res));
app.post('/api/v1/auth/login', (req, res) => forwardRequest(AUTH_SERVICE, 'post', '/login', req, res));

// ====== Rutas Operations Service ======
app.get('/api/v1/operations', (req, res) => forwardRequest(OPERATION_SERVICE, 'get', '/operations', req, res));

// ====== Rutas Records Service ======
app.get('/api/v1/records', (req, res) => forwardRequest(RECORD_SERVICE, 'get', '/records', req, res));
app.post('/api/v1/records', (req, res) => forwardRequest(RECORD_SERVICE, 'post', '/records', req, res));
app.delete('/api/v1/records/:id', (req, res) => forwardRequest(RECORD_SERVICE, 'delete', `/records/${req.params.id}`, req, res));

// ====== Rutas Balance Service ======
app.get('/api/v1/balance/:userId', (req, res) => forwardRequest(BALANCE_SERVICE, 'get', `/balance/${req.params.userId}`, req, res));
app.post('/api/v1/balance/update', (req, res) => forwardRequest(BALANCE_SERVICE, 'post', '/balance/update', req, res));

// ====== Ruta base ======
app.get('/', (req, res) => {
  res.send('✅ API Gateway funcionando con Axios');
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway escuchando en http://localhost:${PORT}`);
});
