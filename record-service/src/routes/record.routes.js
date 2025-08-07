import { Router } from 'express';
import authenticate from '../middlewares/auth.middleware.js';
import { 
    handleNewRecord,
    handleGetUserRecords,
    handleSoftDelete,
    handleExportRecords
} from '../controllers/record.controller.js';

const router = Router();

router.post('/', authenticate, handleNewRecord);
router.get('/', authenticate, handleGetUserRecords);
router.delete('/:recordId', authenticate, handleSoftDelete);
router.get('/export', authenticate, handleExportRecords);

export default router;
