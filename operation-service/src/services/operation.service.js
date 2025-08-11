import Operation from '../models/Operation.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const RECORD_SERVICE = process.env.RECORD_SERVICE;
const BALANCE_SERVICE = process.env.BALANCE_SERVICE;

export async function listOperations() {
  return await Operation.findAll({ attributes: ['type', 'cost'] });
}

export async function executeOperation(type, operands, userId, token) {
  const operation = await Operation.findOne({ where: { type } });
  if (!operation) {
    throw new Error('Invalid Operation');
  }
  const cost = operation.cost;
  const balanceRes = await axios.get(`${BALANCE_SERVICE}/${userId}`, {
    headers: {
      Authorization: token
    }
  });

  const currentBalance = balanceRes.data.balance;

  if (currentBalance < cost) {
    throw new Error('Insufficient balance');
  }

  const newBalance = currentBalance - cost;

  if (
    type !== 'random_string' &&
    (!Array.isArray(operands) || operands.some((n) => typeof n !== 'number' || isNaN(n)))
  ) {
    throw new Error('All operands must be valid numbers');
  }

  let result;
  switch (type) {
    case 'addition':
      result = operands.reduce((a, b) => a + b, 0);
      break;
    case 'subtraction':
      result = operands.reduce((a, b) => a - b);
      break;
    case 'multiplication':
      result = operands.reduce((a, b) => a * b, 1);
      break;
    case 'division':
      result = operands.reduce((a, b) => a / b);
      break;
    case 'square_root':
      if (operands.length !== 1) throw new Error('Only one operand is allowed');
      if (operands[0] < 0) throw new Error('Square root of negative numbers is not allowed'); 
      result = Math.sqrt(operands[0]);
      break;
    case 'random_string':
      result = await generateRandomString();
      break;
    default:
      throw new Error('Operation not supported');
  }

  await axios.post(`${RECORD_SERVICE}/`, {
    operation_type: type,
    amount: cost,
    user_balance: newBalance,
    operation_response: result.toString(),
    user_id: userId,
  }, {
    headers: {
      Authorization: token
    }
  });

  await axios.put(`${BALANCE_SERVICE}/${userId}`, {
    balance: newBalance
  }, {
    headers: {
      Authorization: token
    }
  });

  return {
    result,
    cost: cost,
    newBalance,
  };
}

async function generateRandomString() {
  const response = await fetch('https://www.random.org/strings/?num=1&len=10&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new');
  const text = await response.text();
  return text.trim();
}
