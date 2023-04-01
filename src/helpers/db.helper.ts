import { PrismaClient } from '@prisma/client';
import { logger } from './log.helper';

class PrismaSingleton {
  private _prismaClient: PrismaClient;

  constructor() {
    this._prismaClient = new PrismaClient();
    this._prismaClient
      .$connect()
      .then(() => logger('DB Connect!'))
      .catch(() => logger('DB Error connection!'));
  }

  public getClient() {
    return this._prismaClient;
  }

  public disconnect() {
    this._prismaClient.$disconnect();
  }
}
const prismaSingleton = new PrismaSingleton();
export default prismaSingleton;
