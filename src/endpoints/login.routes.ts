/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { KeyRepository } from '../repository/key.repository';
import { JWT_SECRET_KEY } from '../setting';
import { ADMIN, LOGIN, LOGOUT, PILETS, ROOT } from './routes';
import { verifyToken } from '../middleware/auth.middleware';

const router = express.Router();

router.get(LOGIN, async (req: Request, res: Response, next: NextFunction) => {
  if (verifyToken(req)) {
    return res.redirect(301, `${ADMIN}${PILETS}`);
  }

  res.render('login', {
    title: 'Login',
  });
});

router.get(LOGOUT, async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('token');
  res.redirect(301, `${ROOT}`);
});

router.post(LOGIN, async (req: Request, res: Response, next: NextFunction) => {
  const loginKey = req.body.key;

  if (!loginKey) {
    res.redirect(301, `${LOGIN}?error=Key not valid!`);
  }

  const kRepo = new KeyRepository();
  const result = await kRepo.findKeyByKey(loginKey);

  if (!loginKey || !result) {
    return res.redirect(301, `${LOGIN}?error=Key not valid!`);
  }

  const data = {
    time: Date(),
    userId: result.id,
  };

  const token = jwt.sign(data, JWT_SECRET_KEY);

  res.cookie(`token`, token, {
    maxAge: 1000 * 60 * 10,
  });

  return res.redirect(301, `${ADMIN}${PILETS}`);
});

///EXPORT
const loginRoutes = router;
export default loginRoutes;
