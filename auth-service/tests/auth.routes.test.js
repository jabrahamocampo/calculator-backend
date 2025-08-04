import request from 'supertest';
import app from '../src/app.js';
import sequelize from '../src/config/database.js';
import User from '../src/models/User.js';

describe('Auth Routes', () => {
    beforeAll(async () => {
    await sequelize.sync({ force: true }); // Warning: This removes all data from table, use just for dev/test env.
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'test@example.com',
                    password: '1234'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('message', 'User Registered');

            const user = await User.findOne({ where: { username: 'test@example.com' } });
            expect(user).not.toBeNull();
            expect(user.username).toBe('test@example.com');
        });

        it('should return 400 if email is already registered', async () => {
            const userData = {
                username: 'test@example.com',
                password: '1234'
            };

            const res = await request(app).post('/api/v1/auth/register').send(userData);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toMatch('User already exist');
        });

        it('should return 500 if there is a database error', async () => {
            const originalCreate = User.create;
            User.create = jest.fn(() => {
                throw new Error('Fallo de conexión a la base de datos');
            });

            const res = await request(app).post('/api/v1/auth/register').send({
                username: 'fail@example.com',
                password: '1234',
            });
            
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
            User.create = originalCreate;
        });


    });

    describe('POST /login', () => {
        it('should login successfully and return a token', async () => {
            const userData = {
                username: 'test@example.com',
                password: '1234'
            };
            await request(app).post('/api/v1/auth/register').send({
                username: userData.username,
                password: userData.password
            });

            const res = await request(app).post('/api/v1/auth/login').send(userData);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(typeof res.body.token).toBe('string');
        });

        it('should return 401 with invalid credentials', async () => {
            const res = await request(app).post('/api/v1/auth/login').send({
                username: 'nonexistent@example.com',
                password: 'wrongpassword'
            });

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('error', 'User not found');
        });
    });


});
