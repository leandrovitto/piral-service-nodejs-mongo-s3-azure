/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import { PiletRepository } from '../repository/pilet.repository';
import { PiletVersionRepository } from '../repository/piletVersion.repository';
import { PILETS, ROOT, TRIGGER, VERSIONS } from './routes';
const router = express.Router();

router.get(ROOT, (req, res) => {
  const piletVRepo = new PiletVersionRepository();
  const pilets = piletVRepo.findManyDistinctPiletsVersion(false);

  res.render('home', {
    title: 'Homepage',
    pilets: pilets,
  });
});

router.get(PILETS, (req, res) => {
  const piletVRepo = new PiletVersionRepository();
  const pilets = piletVRepo.findManyDistinctPiletsVersion(false);

  res.render('pilets/pilets', {
    title: 'Pilets',
    pilets: pilets,
  });
});

router.get(`${PILETS}/:id${VERSIONS}`, async (req, res) => {
  const piletId = parseInt(req.params.id);
  const piletRepo = new PiletRepository();
  const pilet = await piletRepo.findById(piletId);

  if (!pilet) {
    return res.render('error404', { title: 'Not Found' });
  }

  const piletVRepo = new PiletVersionRepository();
  const piletVersions = piletVRepo.findManyWithPiletId(piletId);

  res.render('pilet_versions/pilet_versions', {
    title: 'Pilet Versions',
    piletVersions: piletVersions,
    pilet: pilet,
  });
});

router.post(
  `${PILETS}/:id${TRIGGER}`,
  [],
  async (req: Request, res: Response, next: NextFunction) => {
    const piletId = parseInt(req.params.id);

    const piletRepo = new PiletRepository();
    const pilet = await piletRepo.findById(piletId);

    if (!pilet) {
      return res.render('error404', { title: 'Not Found' });
    }
    const stat = await piletRepo.updatePiletEnabled(piletId, !pilet?.enabled);
    res.redirect(301, `${PILETS}`);
  },
);

router.post(
  `${PILETS}/:piletId${VERSIONS}/:id${TRIGGER}`,
  [],
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

    res.redirect(301, `${PILETS}/${piletId}${VERSIONS}`);
  },
);

router.get(`/login`, (req, res) => {
  res.render('login', {
    title: 'Login',
  });
});

///EXPORT
const homeRoutes = router;
export default homeRoutes;
