/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import piletVersionRepository from '../repository/piletVersion.repository';

const getHomeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const pilets = await piletVersionRepository.findManyDistinctPiletsVersion();

  res.render('home', {
    title: 'Homepage',
    pilets: pilets,
  });
};

export { getHomeController };
