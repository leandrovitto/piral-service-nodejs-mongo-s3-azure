/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import {
  getPiletsController,
  publishPiletController,
} from '../controllers/pilets.controller';
import multer from 'multer';
import { UPLOAD_TMP_DIR_NAME } from '../setting';

const router = express.Router();

// GET PILETS
router.get(`/`, getPiletsController);

// POST PILET
const upload = multer({ dest: UPLOAD_TMP_DIR_NAME + '/' });
const cpUpload = upload.single('file');
router.post(`/`, [cpUpload], publishPiletController);

///EXPORT
const piletRoutes = router;
export default piletRoutes;
