import asyncHandler from '../utils/asyncHandler.js';
import { listOperations, executeOperation } from '../services/operation.service.js';
import sequelize from '../config/database.js';
import logger from '../utils/logger.js';

export const getAllOperations = asyncHandler(async (req, res) => {
  const operations = await listOperations();
  res.json(operations);
});

export const performOperation = asyncHandler(async (req, res) => {
  logger.info({ correlationId: req.headers['x-correlation-id'], userId: req.user?.id }, 
    'Executing operation for user'
  );
  
  const { type, operands, params: randomParams } = req.body;

  const userId = req.user.id;
  const token = req.headers['authorization'];
  const key = req.headers['idempotency-key'];
  const correlationId = req.headers['x-correlation-id'];

  const { result, cost, newBalance } = await executeOperation(type, operands, userId, token, correlationId, randomParams);

  const responsePayload = { result, cost, newBalance };

  await sequelize.query(
    `UPDATE idempotency_keys
     SET result = :response
     WHERE user_id = :userId
       AND idempotency_key = :key`,
    {
      replacements: {
        response: JSON.stringify(responsePayload),
        userId,
        key
      },
      type: sequelize.QueryTypes.UPDATE
    }
  );

  res.status(201).json(responsePayload);
});
