import { listOperations, executeOperation } from '../services/operation.service.js';

export async function getAllOperations(req, res) {
  try {
    const operations = await listOperations();
    res.json(operations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function performOperation(req, res) {
  const { type, operands } = req.body;
  const userId = req.user.id;
  const token = req.headers['authorization'];

  try {
    const { result, cost, newBalance } = await executeOperation(type, operands, userId, token);
    res.status(201).json({ result, cost, newBalance });
  } catch (err) {
    console.error('Error executing operation:', err.message);
    res.status(400).json({ error: err.message });
  }
}
