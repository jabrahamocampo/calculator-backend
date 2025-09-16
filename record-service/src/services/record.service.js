import { Op } from 'sequelize';
import Record from '../models/Record.js';
import ApiError from '../errors/ApiError.js';

function formatDateToMMDDYYYY_HHMM(dateString) {
  if (!dateString) return null;

  const date = new Date(dateString); 
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const formatted = date.toLocaleString('en-US', options).replace(',', '');
  return formatted;
}

export async function performOperationForUser({
  operation_type,
  amount,
  user_balance,
  operation_response,
  user_id
}) {
  const record = await Record.create({
    operation_type,
    amount,
    user_balance,
    operation_response,
    user_id,
  });

  if (!record) {
    throw ApiError.badRequest('Operation not registered.');
  }

  return { record };
}

export async function getRecordsByUserId(userId) {
  const records = await Record.findAll({
    where: {
      user_id: userId,
      deleted_at: null,
    },
    order: [['createdAt', 'DESC']],
  });

  if (!records) {
    throw ApiError.notFound('Records not found');
  }

  return records.map(record => ({
    ...record.toJSON(),
    createdAt: formatDateToMMDDYYYY_HHMM(record.createdAt),
    updatedAt: formatDateToMMDDYYYY_HHMM(record.updatedAt)
  }));
}

export async function getUserRecords({
  userId, 
  page, 
  perPage, 
  search, 
  orderBy, 
  order
}) {
  const offset = (page - 1) * perPage;
  const whereClause = {
    user_id: userId,
    deleted_at: null,
    ...(search && {
      operation_type: { [Op.iLike]: `%${search}%` }
    })
  };

  const { count, rows } = await Record.findAndCountAll({
    where: whereClause,
    limit: parseInt(perPage),
    offset: parseInt(offset),
    order: [[orderBy, order.toUpperCase()]],
  });

  const formattedRows = rows.map(record => ({
    ...record.toJSON(),
    createdAt: formatDateToMMDDYYYY_HHMM(record.createdAt),
    updatedAt: formatDateToMMDDYYYY_HHMM(record.updatedAt)
  }));

  return {
    total: count,
    page: parseInt(page),
    perPage: parseInt(perPage),
    records: formattedRows,
  };
}

export async function softDeleteRecord(recordId, userId) {
  const record = await Record.findOne({
    where: {
      id: recordId,
      user_id: userId,
    },
  });

  if (!record) throw ApiError.notFound('Record not found or unauthorized');

  await record.destroy();
  return { message: 'Record successfully deleted' };
}
