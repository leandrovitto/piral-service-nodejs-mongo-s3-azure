/* eslint-disable no-useless-catch */
import { Pilet, PrismaClient } from '@prisma/client';
import { getMessage, logger } from '../helpers';

class PiletRepository {
  client = new PrismaClient();

  create = async (payload: Omit<Pilet, 'id' | 'enabled'>): Promise<Pilet> => {
    try {
      const p = await this.client.pilet.create({
        data: {
          name: payload.name,
          meta: payload.meta || {},
        },
      });
      logger(getMessage('labels.pilet.saved') as string);
      return p;
    } catch (e) {
      throw e;
    }
  };

  findByName = async (name: string): Promise<Pilet | null> => {
    const pilet = await this.client.pilet.findFirst({
      where: { name: name },
    });
    return pilet;
  };
}

export { PiletRepository };
