/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';

const getPilets = (req: Request, res: Response, next: NextFunction) =>
  res.json({ pilets: [] });

export { getPilets };
