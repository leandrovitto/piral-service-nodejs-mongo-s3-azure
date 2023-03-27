/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, RequestHandler, Request, Response } from 'express';
import { KeyService } from '../services/keys.service';
const authHeaderExtract = /^basic\s+([a-fA-F0-9]+)$/i;

async function checkKey(authHeader: string | undefined, scopes: Array<string>) {
  if (!authHeader) return null;
  const keyService = new KeyService();
  const keys = await keyService.getKeys();
  const result = authHeaderExtract.exec(authHeader);
  return result && keys.includes(result[1]);
}

export const checkAuth =
  (...scopes: Array<string>): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authorized = await checkKey(req.headers.authorization, scopes);

    if (!authorized) {
      res.status(401).json({
        success: false,
        message: 'Invalid API key supplied.',
      });
    } else {
      next();
    }
  };
