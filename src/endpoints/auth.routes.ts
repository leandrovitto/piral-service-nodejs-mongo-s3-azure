/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import {
  loginCreateController,
  loginGetController,
  logoutController,
} from '../controllers/auth.controller';
import { checkToken } from '../middleware/auth.middleware';
import { LOGIN, LOGOUT } from './routes';

const router = express.Router();

router.get(LOGIN, loginGetController);
router.post(LOGIN, loginCreateController);

router.get(LOGOUT, [checkToken()], logoutController);

///EXPORT
const authRoutes = router;
export default authRoutes;
