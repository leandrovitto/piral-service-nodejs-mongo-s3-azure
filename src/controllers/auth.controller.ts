/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { ADMIN, AUTH, LOGIN, PILETS, ROOT } from '../endpoints/routes';
import { verifyToken } from '../middleware/auth.middleware';
import { KeyRepository } from '../repository/key.repository';
import { JWT_COOKIE, JWT_SECRET_KEY } from '../setting';
import jwt from 'jsonwebtoken';

const loginGetController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (verifyToken(req)) {
    return res.redirect(`${ADMIN}${PILETS}`);
  }

  res.render('login', {
    title: 'Login',
  });
};

const loginCreateController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const loginKey = req.body.key;

  if (!loginKey) {
    res.redirect(`${AUTH}${LOGIN}?error=Key not valid!`);
  }

  const kRepo = new KeyRepository();
  const result = await kRepo.findKeyByKey(loginKey);

  if (!loginKey || !result) {
    return res.redirect(`${AUTH}${LOGIN}?error=Key not valid!`);
  }

  const data = {
    time: Date(),
    userId: result.id,
  };

  const token = jwt.sign(data, JWT_SECRET_KEY);

  res.cookie(JWT_COOKIE, token, {
    maxAge: 1000 * 60 * 10,
  });

  return res.redirect(`${ADMIN}${PILETS}`);
};

const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.clearCookie(JWT_COOKIE, { path: '/' });
  res.redirect(`${ROOT}`);
};

export { loginGetController, loginCreateController, logoutController };
