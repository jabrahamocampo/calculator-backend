import {
  createUserBalance,
  getUserBalance,
  updateUserBalance
} from '../services/balance.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

export const handleCreateBalance = asyncHandler(async (req, res)  => {
  logger.info({ correlationId: req.headers['x-correlation-id'], userId: req.user?.id }, 'Creating user balance');
  const { userId } = req.body;
  const newBalance = await createUserBalance(userId);
  res.status(201).json(newBalance);
});

export const handleGetBalance = asyncHandler(async (req, res) => {
  logger.info({ correlationId: req.headers['x-correlation-id'], userId: req.user?.id }, 'Getting user balance');
  const { userId } = req.params;
  const balance = await getUserBalance(userId);
  res.status(200).json(balance);
});

export const handleUpdateBalance = asyncHandler(async (req, res) => {
  logger.info({ correlationId: req.headers['x-correlation-id'], userId: req.user?.id }, 'Updating user balance');
  const { userId } = req.params;
  const { balance } = req.body;
  const updated = await updateUserBalance(userId, balance);
  res.status(200).json(updated);
});
