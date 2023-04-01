import { Pilet } from '@prisma/client';
import { getMessage, logger } from '../helpers';
import { BaseRepository } from './base.repository';

export class PiletRepository extends BaseRepository<Pilet> {
  create = async (
    payload: Omit<Pilet, 'id' | 'enabled' | 'createdAt' | 'updatedAt'>,
  ): Promise<Pilet> => {
    const p = await this._client.pilet.create({
      data: {
        name: payload.name,
        meta: payload.meta || {},
      },
    });
    logger(getMessage('labels.pilet.saved') as string);
    return p;
  };

  findById = async (id: number): Promise<Pilet | null> => {
    return await this._client.pilet.findFirst({
      where: { id: id },
    });
  };

  findByName = async (name: string): Promise<Pilet | null> => {
    return await this._client.pilet.findFirst({
      where: { name: name },
    });
  };

  findAll = async (): Promise<Pilet[]> => {
    return await this._client.pilet.findMany({
      orderBy: {
        id: 'desc',
      },
      where: {
        enabled: true,
      },
    });
  };

  updatePiletEnabled = async (id: number, enabled = true): Promise<Pilet> => {
    return await this._client.pilet.update({
      data: {
        enabled: enabled,
      },
      where: {
        id: id,
      },
    });
  };
}
