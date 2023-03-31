/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import { getHomeController } from '../controllers/home.controller';
import { ROOT } from './routes';

const router = express.Router();

router.get(ROOT, getHomeController);

///EXPORT
const homeRoutes = router;
export default homeRoutes;
