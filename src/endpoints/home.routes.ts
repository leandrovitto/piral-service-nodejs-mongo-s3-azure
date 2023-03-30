/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import { PiletRepository } from '../repository/pilet.repository';
import { PiletVersionRepository } from '../repository/piletVersion.repository';
import { PILETS, ROOT, TRIGGER, VERSIONS } from './routes';

const router = express.Router();

router.get(ROOT, async (req: Request, res: Response, next: NextFunction) => {
  const piletVRepo = new PiletVersionRepository();
  const pilets = await piletVRepo.findManyDistinctPiletsVersion(false);

  res.render('home', {
    title: 'Homepage',
    pilets: pilets,
  });
});

///EXPORT
const homeRoutes = router;
export default homeRoutes;
