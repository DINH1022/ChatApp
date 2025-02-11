import { Router } from 'express';
import express from 'express';
import { getMsgs,sendMsg,getUsers } from '../controller/message.controller.js';
import { authenticator } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/users',authenticator,getUsers);
router.get('/msgs/:id',authenticator,getMsgs);
router.post('/msgs/:id',authenticator,sendMsg);

export default router;