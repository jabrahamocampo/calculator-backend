import { Op } from 'sequelize';
import Record from '../models/Record.js';

function formatDateToMMDDYYYY_HHMM(dateString) {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}/${day}/${year} ${hours}:${minutes}`;
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

  if (!record) throw new Error('Record not found or unauthorized');

  await record.destroy();
  return { message: 'Record successfully deleted' };
}
