/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, RequestHandler, Request, Response } from 'express';
import { KeyService } from '../services/keys.service';
import { getMessage, logger } from '../helpers';
import { LOGIN } from '../endpoints/routes';
import { JWT_SECRET_KEY } from '../setting';
import jwt from 'jsonwebtoken';
const authHeaderExtract = /^basic\s+([a-fA-F0-9]+)$/i;

async function checkKey(authHeader: string | undefined, scopes: Array<string>) {
  if (!authHeader) return null;
  const keyService = new KeyService();
  const keys = await keyService.getKeys();
  const result = authHeaderExtract.exec(authHeader);
  return result && keys.includes(result[1]);
}

export function verifyToken(req: Request) {
  return req.cookies && req.cookies.token
    ? jwt.verify(req.cookies.token, JWT_SECRET_KEY)
    : false;
}

export const checkAuth =
  (...scopes: Array<string>): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authorized = await checkKey(req.headers.authorization, scopes);

    if (!authorized) {
      return res.status(401).json({
        success: false,
        message: getMessage('errors.auth.unauthorized'),
      });
    } else {
      next();
    }
  };

export const checkToken =
  (...scopes: Array<string>): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.token) {
      return res.redirect(301, `${LOGIN}`);
    }

    const verified = verifyToken(req);

    if (!verified) {
      return res.redirect(301, `${LOGIN}?error=Key not valid!`);
    }
    // logger(JSON.stringify(verified));
    next();
  };
