/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { KeyRepository } from '../repository/key.repository';
import { JWT_SECRET_KEY } from '../setting';
import { ADMIN, AUTH, LOGIN, LOGOUT, PILETS, ROOT } from './routes';
import { checkToken, verifyToken } from '../middleware/auth.middleware';

const router = express.Router();

router.get(LOGIN, async (req: Request, res: Response, next: NextFunction) => {
  if (verifyToken(req)) {
    return res.redirect(`${ADMIN}${PILETS}`);
  }

  res.render('login', {
    title: 'Login',
  });
});

router.get(
  LOGOUT,
  [checkToken()],
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('token', { path: '/' });
    res.redirect(`${ROOT}`);
  },
);

router.post(LOGIN, async (req: Request, res: Response, next: NextFunction) => {
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

  res.cookie(`token`, token, {
    maxAge: 1000 * 60 * 10,
  });

  return res.redirect(`${ADMIN}${PILETS}`);
});

///EXPORT
const loginRoutes = router;
export default loginRoutes;
