//import User from '../models/User.js';
import { Op } from 'sequelize';
import Record from '../models/Record.js';


export async function performOperationForUser({
     operation_type,
      amount,
      user_balance,
      operation_response,
      user_id
}) {
  const record = await Record.create({
    operation_type: operation_type,
    amount: amount,
    user_balance: user_balance,
    operation_response: operation_response,
    user_id: user_id,
  });

  return {
    record,
  };
}

export async function getRecordsByUserId(userId) {
  const records = await Record.findAll({
    where: {
      user_id: userId,
      deleted_at: null,
    },
    order: [['createdAt', 'DESC']],
  });

  return records;
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

  return {
    total: count,
    page: parseInt(page),
    perPage: parseInt(perPage),
    records: rows,
  };
}

export async function softDeleteRecord(recordId, userId) {
  const record = await Record.findOne({
    where: {
      id: recordId,
      user_id: userId,
    },
  });

  if (!record) throw new Error('Registro no encontrado o no autorizado');

  await record.destroy();
  return { 
    message: 'Registro eliminado correctamente' 
  };
}

