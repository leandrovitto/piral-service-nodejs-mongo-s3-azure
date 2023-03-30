import { prismaClient } from './../index';
/* eslint-disable no-useless-catch */
import { Pilet } from '@prisma/client';
import { getMessage, logger } from '../helpers';

class PiletRepository {
  client = prismaClient;

  create = async (
    payload: Omit<Pilet, 'id' | 'enabled' | 'createdAt' | 'updatedAt'>,
  ): Promise<Pilet> => {
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

  findById = async (id: number): Promise<Pilet | null> => {
    const pilet = await this.client.pilet.findFirst({
      where: { id: id },
    });
    return pilet;
  };

  findByName = async (name: string): Promise<Pilet | null> => {
    const pilet = await this.client.pilet.findFirst({
      where: { name: name },
    });
    return pilet;
  };

  findMany = async (): Promise<Pilet[]> => {
    const pilets = await this.client.pilet.findMany({
      orderBy: {
        id: 'desc',
      },
      where: {
        enabled: true,
      },
    });

    return pilets;
  };

  updatePiletEnabled = async (id: number, enabled = true) => {
    await this.client.pilet.update({
      data: {
        enabled: enabled,
      },
      where: {
        id: id,
      },
    });
  };
}

export { PiletRepository };
