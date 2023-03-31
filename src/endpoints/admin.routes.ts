/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import { PiletRepository } from '../repository/pilet.repository';
import { PiletVersionRepository } from '../repository/piletVersion.repository';
import { ADMIN, PILETS, ROOT, TRIGGER, VERSIONS } from './routes';
import { checkToken } from '../middleware/auth.middleware';

const router = express.Router();

router.get(
  `${PILETS}`,
  [checkToken()],
  async (req: Request, res: Response, next: NextFunction) => {
    const piletVRepo = new PiletVersionRepository();
    const pilets = await piletVRepo.findManyDistinctPiletsVersion(false);

    res.render('pilets/pilets', {
      title: 'Pilets',
      pilets: pilets,
    });
  },
);

router.get(
  `${PILETS}/:id${VERSIONS}`,
  [checkToken()],
  async (req: Request, res: Response, next: NextFunction) => {
    const piletId = parseInt(req.params.id);
    const piletRepo = new PiletRepository();
    const pilet = await piletRepo.findById(piletId);

    if (!pilet) {
      return res.render('error404', { title: 'Not Found' });
    }

    const piletVRepo = new PiletVersionRepository();
    const piletVersions = await piletVRepo.findManyWithPiletId(piletId);

    res.render('pilet_versions/pilet_versions', {
      title: 'Pilet Versions',
      piletVersions: piletVersions,
      pilet: pilet,
    });
  },
);

router.post(
  `${PILETS}/:id${TRIGGER}`,
  [checkToken()],
  async (req: Request, res: Response, next: NextFunction) => {
    const piletId = parseInt(req.params.id);

    const piletRepo = new PiletRepository();
    const pilet = await piletRepo.findById(piletId);

    if (!pilet) {
      return res.render('error404', { title: 'Not Found' });
    }
    const stat = await piletRepo.updatePiletEnabled(piletId, !pilet?.enabled);
    res.redirect(`${ADMIN}${PILETS}`);
  },
);

router.post(
  `${PILETS}/:piletId${VERSIONS}/:id${TRIGGER}`,
  [checkToken()],
  async (req: Request, res: Response, next: NextFunction) => {
    const piletId = parseInt(req.params.piletId);
    const id = parseInt(req.params.id);

    const piletRepo = new PiletRepository();
    const piletVRepo = new PiletVersionRepository();
    const pilet = await piletRepo.findById(piletId);
    const piletV = await piletVRepo.findById(id);

    if (!pilet || !piletV) {
      return res.render('error404', { title: 'Not Found' });
    }

    await piletVRepo.updatePiletVersionEnabled(id);
    await piletVRepo.disabledOthersPiletVersion(id, piletId);

    res.redirect(`${ADMIN}${PILETS}/${piletId}${VERSIONS}`);
  },
);

///EXPORT
const adminRoutes = router;
export default adminRoutes;
