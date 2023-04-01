import { Keys } from '@prisma/client';
import { BaseRepository } from './base.repository';

export class KeyRepository extends BaseRepository<Keys> {
  async create(item: Keys): Promise<Keys> {
    return await this._client.keys.create({
      data: {
        key: item.key,
      },
    });
  }

  async findAll(): Promise<Keys[]> {
    return await this._client.keys.findMany();
  }

  async findKeyByKey(key: string): Promise<Keys | null> {
    return await this._client.keys.findUnique({
      where: { key: key },
    });
  }
}
