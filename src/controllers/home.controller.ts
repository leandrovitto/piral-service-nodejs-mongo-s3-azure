/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { PiletVersionRepository } from '../repository/piletVersion.repository';

const getHomeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const piletVRepo = new PiletVersionRepository();
  const pilets = await piletVRepo.findManyDistinctPiletsVersion();

  res.render('home', {
    title: 'Homepage',
    pilets: pilets,
  });
};

export { getHomeController };
