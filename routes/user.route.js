import express from 'express';
import { signup,login,logout, getAllUsers } from '../controllers/user.controller.js';
import secureRoute from '../middleware/secureRoute.js';

const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.get('/getAllUsers',secureRoute, getAllUsers)

export default router;