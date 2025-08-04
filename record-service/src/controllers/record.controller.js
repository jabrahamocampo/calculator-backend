import { 
    performOperationForUser, 
    getUserRecords,
    softDeleteRecord
} from '../services/record.service.js';
import { exportUserRecords } from "../services/export.service.js";

export async function handleNewRecord(req, res) {
  const {  
      operation_type,
      amount,
      user_balance,
      operation_response,
      user_id} = req.body;

  try {
    const { record } = await performOperationForUser({
     operation_type,
      amount,
      user_balance,
      operation_response,
      user_id,
    });

    res.status(201).json({
      message: 'Operación registrada con éxito',
      record
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function handleGetUserRecords(req, res) {
  const userId  = req.user.id;
  const {
    page = 1,
    perPage = 10,
    search = '',
    orderBy = 'createdAt',
    order = 'desc'
  } = req.query;
  
  try {
    const result = await getUserRecords({
      userId,
      page,
      perPage,
      search,
      orderBy,
      order
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function handleSoftDelete(req, res) {
  const { recordId } = req.params;
  const userId  = req.user.id;
  console.log('El user id para borrar el record es: ', userId);
  try {
    const result = await softDeleteRecord(recordId, userId);
    res.json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export async function handleExportRecords(req, res) {
  const userId = req.user.id; 

  try {
    const { presignedUrl } = await exportUserRecords(userId);
    return res.status(200).json({ url: presignedUrl });
  } catch (error) {
    console.error("Export error:", error);
    return res.status(500).json({ message: "Failed to export records" });
  }
}



