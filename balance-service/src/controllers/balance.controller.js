import {
  createUserBalance,
  getUserBalance,
  updateUserBalance
} from '../services/balance.service.js';

export async function handleCreateBalance(req, res) {
  const { userId } = req.body;

  try {
    const newBalance = await createUserBalance(userId);
    res.status(201).json(newBalance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function handleGetBalance(req, res) {
  const { userId } = req.params;

  try {
    const balance = await getUserBalance(userId);
    res.status(200).json(balance);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export async function handleUpdateBalance(req, res) {
  const { userId } = req.params;
  const { balance } = req.body;

  try {
    const updated = await updateUserBalance(userId, balance);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
