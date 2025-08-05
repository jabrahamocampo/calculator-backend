import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import axios from 'axios';

const SALT_ROUNDS = 10;

export async function registerUser(username, password) {
  const existing = await User.findOne({ where: { username } });
  if (existing) throw new Error('User already exist');

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ username, password: hashedPassword });
  
  //Call balance service to register new userId and initial balance (20 credits)
  try{
    //await axios.post('http://localhost:4003', {
    await axios.post('https://calculator-backend-balance-service.onrender.com', {
      userId: user.id,
    });
   
  }catch(err){
    console.error('Error creating initial balance: ', err.messaje);
  }

  return user;
}

export async function loginUser(username, password) {
  const user = await User.findOne({ where: { username } });
  if (!user) throw new Error('User not found');
  if (user.status !== 'active') throw new Error('Inactive account');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Wrong password');

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return { token };
}
