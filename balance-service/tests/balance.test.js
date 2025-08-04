import request from 'supertest';
import app from '../src/app.js';
import sequelize from '../src/config/database.js';
import Balance from '../src/models/UserBalance.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';


const generateTestToken = () => {
    const testPayload = {
    userId: '33e4417f-eaf1-4303-8140-4546f07a5142',
    username: 'test@example.com',
    role: 'user'
  };
  return jwt.sign(testPayload, JWT_SECRET, { expiresIn: '1h' });
};

describe('Balance Service Tests', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true }); 
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(async () => {
        await Balance.create({
            user_id: '33e4417f-eaf1-4303-8140-4546f07a5142',
            balance: 20
        });
    });

    /*afterEach(async () => {
        await Balance.destroy({ where: {} });
    });*/


    it('Balance query by userId', async () => {
        const mockUserId = '33e4417f-eaf1-4303-8140-4546f07a5142';
        const token = generateTestToken();   
        const res = await request(app)
            .get(`/api/v1/balance/${mockUserId}`)
            .set('Authorization', `Bearer ${token}`);
  
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('user_id', mockUserId);
        expect(res.body).toHaveProperty('balance', 20);
    });
/*
   it('Error si userId no existe', async () => {
        const nonExistentUserId = '00000000-0000-0000-0000-000000000000';
        const token = generateTestToken();   
        const res = await request(app)
            .get(`/api/v1/balance/${nonExistentUserId}`)
            .set('Authorization', `Bearer ${token}`);
        
        console.log("MESSAGE: ", res.status);
        expect(res.status).toBe(200);
       // expect(res.body.error).toMatch('User not found');
    });

it('Balance update (deduct amount)', async () => {
        const res = await request(app)
            .patch(`/api/v1/balance/${mockUserId}`)
            .send({ amount: 10 });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Balance updated successfully');

        const balance = await Balance.findOne({ where: { userId: mockUserId } });
        expect(balance.amount).toBeCloseTo(10);
    });

    it('Error if there is not enough balance', async () => {
        const res = await request(app)
            .patch(`/api/v1/balance/${mockUserId}`)
            .send({ amount: 200 });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch('insufficient balance');
    });


    */



});
