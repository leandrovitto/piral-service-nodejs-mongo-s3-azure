import { Keys, PrismaClient } from '@prisma/client';

class KeyRepository {
  client = new PrismaClient();

  findAll = async (): Promise<Keys[] | null> => {
    const keys = await this.client.keys.findMany();
    return keys;
  };
}

export { KeyRepository };
