/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import {
  getPiletsController,
  publishPiletController,
} from '../controllers/pilets.controller';
import multer from 'multer';
import { UPLOADS__DIRECTORY } from '../setting';
import { checkAuth } from '../middleware/auth.middleware';
import { ROOT } from './routes';

const router = express.Router();

// GET PILETS
router.get(ROOT, getPiletsController);

// POST PILET
const upload = multer({ dest: UPLOADS__DIRECTORY + '/' });
const cpUpload = upload.single('file');
router.post(ROOT, [checkAuth(), cpUpload], publishPiletController);

///EXPORT
const piletRoutes = router;
export default piletRoutes;
