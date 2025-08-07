import { Router } from 'express';
import authenticate from '../middlewares/auth.middleware.js';
import {
  handleCreateBalance,
  handleGetBalance,
  handleUpdateBalance
} from '../controllers/balance.controller.js';

const router = Router();

router.post('/', handleCreateBalance);
router.get('/:userId', authenticate, handleGetBalance); 
router.put('/:userId', authenticate, handleUpdateBalance); 

export default router;
