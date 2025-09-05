import Operation from '../models/Operation.js';
import dotenv from 'dotenv';
import axios from 'axios';
import ApiError from '../errors/ApiError.js';
import Decimal from '../config/decimal.config.js';

dotenv.config();

const RECORD_SERVICE = process.env.RECORD_SERVICE;
const BALANCE_SERVICE = process.env.BALANCE_SERVICE;

export async function listOperations() {
  const allOperatoins = await Operation.findAll({ attributes: ['type', 'cost'] });
  if (!allOperatoins) {
    throw ApiError.notFound('Operations not found');
  }
  return allOperatoins;
}

export async function executeOperation(type, operands, userId, token, correlationId, randomParams) {
  if (!type && !operands) throw ApiError.badRequest('Please provide operation and operands.');

  const operation = await Operation.findOne({ where: { type } });
  if (!operation) {
    throw ApiError.notFound('Invalid Operation');
  }
  
  const balanceRes = await axios.get(`${BALANCE_SERVICE}/${userId}`, {
    headers: {
      Authorization: token,
      ['x-correlation-id'] : correlationId,
    }
  });

  const cost = operation.cost;
  const currentBalance = balanceRes.data.balance;

  if (currentBalance < cost) {
    throw ApiError.badRequest('Insufficient balance');
  }

  if (
    type !== 'random_string' &&
    (!Array.isArray(operands) || operands.some((n) => typeof n !== 'number' || isNaN(n)))
  ) {
    throw ApiError.badRequest('All operands must be valid numbers. Please try again.');
  }

  let result;
  switch (type) {
    case 'addition':
      result = operands
        .reduce((a, b) => new Decimal(a).plus(b), new Decimal(0))
        .toFixed(2);
      break;

    case 'subtraction':
      result = operands
        .reduce((a, b) => new Decimal(a).minus(b))
        .toFixed(2);
      break;

    case 'multiplication':
      result = operands
        .reduce((a, b) => new Decimal(a).times(b), new Decimal(1))
        .toFixed(2);
      break;

    case 'division':
      const values = operands.slice(1);
      if (values.some(v => new Decimal(v).isZero())) {
        throw ApiError.badRequest('Cannot divide by zero. Please enter a different divisor.');
      }
      if (operands.length === 1) {
        throw ApiError.badRequest('Please enter both numbers: the dividend and the divisor.');
      }
      result = operands
        .reduce((a, b) => new Decimal(a).dividedBy(b))
        .toFixed(2);
      break;

    case 'square_root':
      if (operands.length !== 1) {
        throw ApiError.badRequest('Only one operand is allowed. Please try again.');
      }
      if (new Decimal(operands[0]).isNegative()) {
        throw ApiError.badRequest('Square root of negative numbers is not allowed. Please try with positive number.');
      }
      result = new Decimal(operands[0]).sqrt().toFixed(2);
      break;

    case 'random_string':
      result = await generateRandomString(randomParams);
      break;

    default:
      throw ApiError.badRequest('Operation not supported');
  }
  
  const newBalance = currentBalance - cost;

  // Saving Record
  await axios.post(`${RECORD_SERVICE}/`, {
    operation_type: type,
    amount: cost,
    user_balance: newBalance,
    operation_response: result.toString(),
    user_id: userId,
  }, {
    headers: {
      Authorization: token,
      ['x-correlation-id'] : correlationId,
    }
  });

  // Updating balance
  await axios.put(`${BALANCE_SERVICE}/${userId}`, {
    balance: newBalance
  }, {
    headers: {
      Authorization: token,
      ['x-correlation-id'] : correlationId,
    }
  });

  return {
    result,
    cost: cost,
    newBalance,
  };
}

async function generateRandomString(randomParams) {
  const url = `https://www.random.org/strings/?num=${randomParams.num}&len=${randomParams.len}&digits=${randomParams.digits}&upperalpha=${randomParams.upperalpha}&loweralpha=${randomParams.loweralpha}&unique${randomParams.unique}&format=plain&rnd=new`;
  const response = await fetch(url);
  const text = await response.text();
  return text.trim().split("\n");
}
