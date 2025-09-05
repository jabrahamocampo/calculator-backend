import client from 'prom-client';

// Metrics collection (CPU, RAM, etc.)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

export const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total of requests',
  labelNames: ['method', 'route', 'status'],
});

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Request Duration Seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5],
});
