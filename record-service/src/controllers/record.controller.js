import { 
    performOperationForUser, 
    getUserRecords,
    softDeleteRecord
} from '../services/record.service.js';
import { exportUserRecords } from "../services/export.service.js";
import asyncHandler from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

export const handleNewRecord = asyncHandler(async (req, res) => {
  logger.info({ correlationId: req.headers['x-correlation-id'], userId: req.user?.id }, 'New user record');
  const {  
      operation_type,
      amount,
      user_balance,
      operation_response,
      user_id 
  } = req.body;

  const { record } = await performOperationForUser({
     operation_type,
      amount,
      user_balance,
      operation_response,
      user_id,
    });

    res.status(201).json({
      message: 'Operation registered successfully',
      record
    });
});

export const handleGetUserRecords = asyncHandler(async (req, res) => {
  logger.info({ correlationId: req.headers['x-correlation-id'], userId: req.user?.id }, 'Getting user record');
  const userId  = req.user.id;
  const {
    page = 1,
    perPage = 10,
    search = '',
    orderBy = 'createdAt',
    order = 'desc'
  } = req.query;
  
  const result = await getUserRecords({
      userId,
      page,
      perPage,
      search,
      orderBy,
      order
    });

    res.json(result);
});

export const handleSoftDelete = asyncHandler(async (req, res) => {
  logger.info({ correlationId: req.headers['x-correlation-id'], userId: req.user?.id }, 'Soft Deleting user record');
  const { recordId } = req.params;
  const userId  = req.user.id;
  const result = await softDeleteRecord(recordId, userId);
  res.status(200).json(result);
});

export const handleExportRecords = asyncHandler(async (req, res) => {
  logger.info({ correlationId: req.headers['x-correlation-id'], userId: req.user?.id }, 'Exporting to AWS S3 user records');
  const userId = req.user.id; 
  const { presignedUrl } = await exportUserRecords(userId);
  return res.status(200).json({ url: presignedUrl });
});



