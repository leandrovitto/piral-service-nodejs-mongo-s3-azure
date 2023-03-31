/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { ADMIN, PILETS, VERSIONS } from '../endpoints/routes';
import { PiletRepository } from '../repository/pilet.repository';
import { PiletVersionRepository } from '../repository/piletVersion.repository';

const getPiletsAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const piletVRepo = new PiletVersionRepository();
  const pilets = await piletVRepo.findManyDistinctPiletsVersion(false);

  res.render('pilets/pilets', {
    title: 'Pilets',
    pilets: pilets,
  });
};

const getPiletVersionsAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
};

const triggerPiletAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const piletId = parseInt(req.params.id);

  const piletRepo = new PiletRepository();
  const pilet = await piletRepo.findById(piletId);

  if (!pilet) {
    return res.render('error404', { title: 'Not Found' });
  }
  const stat = await piletRepo.updatePiletEnabled(piletId, !pilet?.enabled);
  res.redirect(`${ADMIN}${PILETS}`);
};

const triggerPiletVersionAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
};

export {
  getPiletVersionsAdminController,
  getPiletsAdminController,
  triggerPiletAdminController,
  triggerPiletVersionAdminController,
};
