/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import {
  getPiletsController,
  publishPiletController,
} from '../controllers/pilets.controller';
import multer from 'multer';
import { UPLOADS__DIRECTORY } from '../setting';

const router = express.Router();

// GET PILETS
router.get(`/`, getPiletsController);

// POST PILET
const upload = multer({ dest: UPLOADS__DIRECTORY + '/' });
const cpUpload = upload.single('file');
router.post(`/`, [cpUpload], publishPiletController);

///EXPORT
const piletRoutes = router;
export default piletRoutes;
