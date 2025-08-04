import request from 'supertest';
import app from '../src/app.js';

describe('Record Service - Root Endpoint', () => {
  it('GET / should return service status', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Record Service is running');
  });
});
