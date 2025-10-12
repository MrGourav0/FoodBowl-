import express from 'express';
import { getCurrentUser } from '../controllers/user.controllers.js';
import isAuth from '../middlewares/isAuth.js';

const router = express.Router();

router.get('/current', isAuth, getCurrentUser);

export default router;
