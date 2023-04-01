/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { ADMIN, PILETS, VERSIONS } from '../endpoints/routes';
import { PiletVersionRepository } from '../repository/piletVersion.repository';
import { PiletRepository } from '../repository/pilet.repository';

const getPiletsAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const piletVersionRepository = new PiletVersionRepository();
  const pilets = await piletVersionRepository.findManyDistinctPiletsVersion(
    false,
  );

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
  const piletVersionRepository = new PiletVersionRepository();
  const pilet = await piletVersionRepository.findById(piletId);

  if (!pilet) {
    return res.render('error404', { title: 'Not Found' });
  }

  const piletVersions = await piletVersionRepository.findManyWithPiletId(
    piletId,
  );

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

  const piletRepository = new PiletRepository();
  const pilet = await piletRepository.findById(piletId);

  if (!pilet) {
    return res.render('error404', { title: 'Not Found' });
  }
  const stat = await piletRepository.updatePiletEnabled(
    piletId,
    !pilet?.enabled,
  );
  res.redirect(`${ADMIN}${PILETS}`);
};

const triggerPiletVersionAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const piletId = parseInt(req.params.piletId);
  const id = parseInt(req.params.id);

  const piletRepository = new PiletRepository();
  const piletVersionRepository = new PiletVersionRepository();

  const pilet = await piletRepository.findById(piletId);
  const piletV = await piletVersionRepository.findById(id);

  if (!pilet || !piletV) {
    return res.render('error404', { title: 'Not Found' });
  }

  await piletVersionRepository.updatePiletVersionEnabled(id);
  await piletVersionRepository.disabledOthersPiletVersion(id, piletId);

  res.redirect(`${ADMIN}${PILETS}/${piletId}${VERSIONS}`);
};

export {
  getPiletVersionsAdminController,
  getPiletsAdminController,
  triggerPiletAdminController,
  triggerPiletVersionAdminController,
};
