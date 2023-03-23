/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import { getPilets, publishPilet } from '../controllers/pilets.controller';
import multer from 'multer';
import { UPLOAD_TMP_DIR_NAME } from '../setting';

const router = express.Router();

router.get(`/`, getPilets);

const upload = multer({ dest: UPLOAD_TMP_DIR_NAME + '/' });
const cpUpload = upload.single('file');
router.post(`/`, [cpUpload], publishPilet);

const piletRoutes = router;
export default piletRoutes;
