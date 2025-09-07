import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

dotenv.config();
const app = express();
app.use(express.json());

const allowedOrigins = [
  process.env.DEV_APPLICATION, // Local App
  process.env.DEV_API_GATEWAY, //local api-gateway
  process.env.PROD_APPLICATION // Production App
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Idempotency-Key", "X-Correlation-Id", "X-User-Id"],
  exposedHeaders: ["X-Correlation-Id"],
  credentials: true
}));

if (!process.env.JWT_SECRET) {
  throw new Error("FATAL: Missing JWT_SECRET");
}

const PORT = process.env.PORT || 8080;

const swaggerDocument = YAML.load('./openapi.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Environment Variables 
const AUTH_SERVICE = process.env.AUTH_SERVICE; 
const OPERATION_SERVICE = process.env.OPERATION_SERVICE;
const RECORD_SERVICE = process.env.RECORD_SERVICE;
const BALANCE_SERVICE = process.env.BALANCE_SERVICE;

// Auxiliar function for internal request
async function forwardRequest(serviceUrl, method, path, req, res) {
  try {
    const response = await axios({
      method,
      url: `${serviceUrl}${path}`,
      data: req.body,
      params: req.query,
      headers: { 
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Authorization': req.headers['authorization'], // JWT 
        'Idempotency-Key': req.headers['idempotency-key'], // custom header
        'X-Correlation-Id': req.headers['x-correlation-id'], 
        "X-User-Id": req.headers['x-user-id'] // custom header
      }
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Error en API Gateway' });
  }
}

//Auth Service Routes
app.post('/api/v1/auth/register', (req, res) => forwardRequest(AUTH_SERVICE, 'post', '/auth/register', req, res));
app.post('/api/v1/auth/login', (req, res) => forwardRequest(AUTH_SERVICE, 'post', '/auth/login', req, res));

// Operations Service Routes
app.get('/api/v1/operations/list', (req, res) => forwardRequest(OPERATION_SERVICE, 'get', '/operations/list', req, res));
app.post('/api/v1/operations/execute', (req, res) => forwardRequest(OPERATION_SERVICE, 'post', '/operations/execute', req, res));

// Records Service Routes
app.get('/api/v1/records', (req, res) => forwardRequest(RECORD_SERVICE, 'get', '/', req, res)); 
app.post('/api/v1/records', (req, res) => forwardRequest(RECORD_SERVICE, 'post', '/', req, res));
app.delete('/api/v1/records/:id', (req, res) => forwardRequest(RECORD_SERVICE, 'delete', `/${req.params.id}`, req, res));
app.get('/api/v1/records/export', (req, res) => {
forwardRequest(RECORD_SERVICE, 'get', '/export', req, res); 
});  

// Balance Service Routes
app.get('/api/v1/balance/:userId', (req, res) => forwardRequest(BALANCE_SERVICE, 'get', `/${req.params.userId}`, req, res));
app.post('/api/v1/balance/', (req, res) => forwardRequest(BALANCE_SERVICE, 'post', '/', req, res));
app.put('/api/v1/balance/', (req, res) => forwardRequest(BALANCE_SERVICE, 'put', `/${req.params.userId}`, req, res));

// Base Route
app.get('/', (req, res) => {
  res.send('API Gateway working with Axios');
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'api-gateway' });
});

app.listen(PORT, () => {
  console.log(`API Gateway listening on http://localhost:${PORT}`);
});
