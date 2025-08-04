import { Router } from 'express';
import authenticate from '../middlewares/auth.middleware.js';
import {
  handleCreateBalance,
  handleGetBalance,
  handleUpdateBalance
} from '../controllers/balance.controller.js';


const router = Router();

router.post('/', handleCreateBalance);               // POST /api/v1/balance
router.get('/:userId', authenticate, handleGetBalance);            // GET  /api/v1/balance/:userId
router.put('/:userId', authenticate, handleUpdateBalance);         // PUT  /api/v1/balance/:userId

export default router;
