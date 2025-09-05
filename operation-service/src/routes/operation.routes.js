import { Router } from 'express';
import authenticate from '../middlewares/auth.middleware.js';
import { getAllOperations, performOperation } from '../controllers/operation.controller.js';
import { idempotencyMiddleware } from '../middlewares/idempotency.middleware.js';

const router = Router();

router.get('/list', authenticate, getAllOperations);
router.post('/execute', authenticate, idempotencyMiddleware,  performOperation);

export default router;
