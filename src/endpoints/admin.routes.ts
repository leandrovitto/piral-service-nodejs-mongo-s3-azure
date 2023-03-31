/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import {
  getPiletVersionsAdminController,
  getPiletsAdminController,
  triggerPiletAdminController,
  triggerPiletVersionAdminController,
} from '../controllers/admin.controller';
import { checkToken } from '../middleware/auth.middleware';
import { PILETS, TRIGGER, VERSIONS } from './routes';

const router = express.Router();

router.get(`${PILETS}`, [checkToken()], getPiletsAdminController);

router.get(
  `${PILETS}/:id${VERSIONS}`,
  [checkToken()],
  getPiletVersionsAdminController,
);

router.post(
  `${PILETS}/:id${TRIGGER}`,
  [checkToken()],
  triggerPiletAdminController,
);

router.post(
  `${PILETS}/:piletId${VERSIONS}/:id${TRIGGER}`,
  [checkToken()],
  triggerPiletVersionAdminController,
);

///EXPORT
const adminRoutes = router;
export default adminRoutes;
