import express from 'express';
import { signin,signup,logout,update, checkAuth } from '../controller/auth.controller.js';
import { authenticator } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/sign_in',signin);
router.post('/sign_up',signup);

router.post('/logout',authenticator,logout);
router.post('/update',authenticator,update);
router.get('/check_auth',authenticator,checkAuth);

export default router;