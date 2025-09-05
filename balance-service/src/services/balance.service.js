import ApiError from '../errors/ApiError.js';
import UserBalance from '../models/UserBalance.js';

export async function createUserBalance(userId) {
  const exists = await UserBalance.findOne({ where: { user_id: userId } });
  if (exists) throw ApiError.badRequest('User balance already exists');
  return await UserBalance.create({ user_id: userId });
}

export async function getUserBalance(userId) {
  const balance = await UserBalance.findOne({ where: { user_id: userId } });
  if (!balance) throw ApiError.notFound('User not found');
  return balance;
}

export async function updateUserBalance(userId, newBalance) {
  const balance = await UserBalance.findOne({ where: { user_id: userId } });
  if (!balance) throw ApiError.notFound('User not found');

  balance.balance = newBalance;
  await balance.save();
  return balance;
}
