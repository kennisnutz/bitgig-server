import express from 'express';
import { logout, login, register } from '../controllers/auth.controller.js';

const router = express();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
