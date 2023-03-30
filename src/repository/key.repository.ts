import { Keys } from '@prisma/client';
import { prismaClient } from './../index';

class KeyRepository {
  client = prismaClient;

  findAll = async (): Promise<Keys[] | null> => {
    const keys = await this.client.keys.findMany();
    return keys;
  };

  findKeyByKey = async (key: string): Promise<Keys | null> => {
    const keyF = await this.client.keys.findFirst({
      where: { key: key },
    });
    return keyF;
  };
}

export { KeyRepository };
