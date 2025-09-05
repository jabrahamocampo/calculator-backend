import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import axios from 'axios';
import ApiError from '../errors/ApiError.js';
import dotenv from 'dotenv';

dotenv.config();
const SALT_ROUNDS = 10;

export async function registerUser(username, password, correlationId) {
  const existing = await User.findOne({ where: { username } });
  if (existing) throw ApiError.badRequest('User already exist');
  
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ username, password: hashedPassword });
 
  //Call balance service to register new userId and initial balance (20 credits)
  try{
    await axios.post(`${process.env.BALANCE_SERVICE}`, {
      userId: user.id,
    },
    {
      headers: {
        ['x-correlation-id'] : correlationId,
        'Content-Type': 'application/json' 
      }
    });
  }catch(err){
    throw ApiError.badRequest('Error creating initial balance: ', err.response?.data || err.message);
  }
  return user;
}

export async function loginUser(username, password) {
  // Input validation
  if (!username || !password) {
    throw ApiError.badRequest('username and password are required');
  }

  let user;
  try {
    user = await User.findOne({ where: { username } });
  } catch (err) {
    // DB error
    throw ApiError.internal('Database error while fetching user', err);
  }

  if (!user) {
    // Not found -> 404
    throw ApiError.notFound('User not found');
  }

  // Validate user status
  if (user.status && user.status !== 'active') {
    throw ApiError.badRequest('Inactive account');
  }

  // Compare password safely
  try {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw ApiError.badRequest('Wrong password');
    }
  } catch (err) {
    // bcrypt threw or other problem
    throw ApiError.internal('Error validating credentials', err);
  }

  // Ensure JWT secret exists
  if (!process.env.JWT_SECRET) {
    throw ApiError.internal('Missing JWT_SECRET');
  }

  // Create token
  let token;
  try {
    token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
  } catch (err) {
    throw ApiError.internal('Error generating token', err);
  }

  return { token };
}
