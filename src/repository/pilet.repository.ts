/* eslint-disable no-useless-catch */
import { Pilet, PrismaClient } from '@prisma/client';

class PiletRepository {
  //constructor(parameters) {}
  client = new PrismaClient();

  create = async (payload: Omit<Pilet, 'id' | 'enabled'>): Promise<Pilet> => {
    try {
      const p = await this.client.pilet.create({
        data: {
          name: payload.name,
          meta: payload.meta || {},
        },
      });
      // eslint-disable-next-line no-console
      console.log('------> Record write in DB');
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
