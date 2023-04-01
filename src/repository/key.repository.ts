import { Keys, PrismaClient } from '@prisma/client';
import prismaSingleton from '../helpers/db.helper';

class KeyRepository {
  private _client;

  constructor(prisma_client: PrismaClient) {
    this._client = prisma_client;
  }

  create = async (key: string): Promise<Keys | null> => {
    return await this._client.keys.create({
      data: {
        key: key,
      },
    });
  };

  findAll = async (): Promise<Keys[] | null> => {
    return await this._client.keys.findMany();
  };

  findKeyByKey = async (key: string): Promise<Keys | null> => {
    return await this._client.keys.findUnique({
      where: { key: key },
    });
  };
}

const keyRepository = new KeyRepository(prismaSingleton.getClient());
export default keyRepository;
