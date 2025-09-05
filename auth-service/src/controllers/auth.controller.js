import { registerUser, loginUser } from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

export const register = asyncHandler(async (req, res) => {
  logger.info({ correlationId: req.headers['x-correlation-id'], userId: req.user?.id }, 'Registering user');
  const { username, password } = req.body;
  const correlationId = req.headers['x-correlation-id'];
  const user = await registerUser(username, password, correlationId);
  res.status(201).json({ message: 'User Registered', user: { id: user.id, username: user.username } });
});

export const login = asyncHandler(async (req, res) => {
  logger.info({ correlationId: req.headers['x-correlation-id'], userId: req.user?.id }, 'Login user');
  const { username, password } = req.body;
  const { token } = await loginUser(username, password);
  res.status(200).json({ message: 'Login successful', token });  
});
