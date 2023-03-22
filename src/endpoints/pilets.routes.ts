/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import { getPilets } from '../controllers/pilets.controller';

const router = express.Router();

router.get(`/`, getPilets);

const piletRoutes = router;
export default piletRoutes;
