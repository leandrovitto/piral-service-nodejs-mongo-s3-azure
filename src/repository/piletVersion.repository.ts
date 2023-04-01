import { PiletVersion, Prisma } from '@prisma/client';
import { getMessage, logger } from '../helpers';
import { PiletVersionWithPilet } from '../types/model';
import { BaseRepository } from './base.repository';

export class PiletVersionRepository extends BaseRepository<PiletVersion> {
  create = async (
    payload: Omit<PiletVersion, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PiletVersionWithPilet> => {
    try {
      const p = await this._client.piletVersion.create({
        data: {
          piletId: payload.piletId,
          meta: payload.meta || {},
          version: payload.version,
          root: payload.root,
          integrity: payload.integrity,
          spec: payload.spec,
          link: payload.link,
          enabled: payload.enabled,
        },
        include: {
          pilet: true,
        },
      });
      logger(getMessage('labels.piletVersion.saved') as string);
      return p;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          logger(getMessage('labels.piletVersion.unique') as string);
        }
      }
      throw e;
    }
  };

  findByPiletIdAndVersion = async (
    piletId: number,
    version: string,
  ): Promise<PiletVersion | null> => {
    const pilet = await this._client.piletVersion.findFirst({
      where: {
        version: version,
        piletId: piletId,
      },
    });
    return pilet;
  };

  findById = async (id: number): Promise<PiletVersion | null> => {
    const pilet = await this._client.piletVersion.findFirst({
      where: {
        id: id,
      },
    });
    return pilet;
  };

  disabledOthersPiletVersion = async (id: number, piletId: number) => {
    return await this._client.piletVersion.updateMany({
      data: {
        enabled: false,
      },
      where: {
        piletId: piletId,
        id: {
          not: id,
        },
      },
    });
  };

  updatePiletVersionEnabled = async (id: number, enabled = true) => {
    return await this._client.piletVersion.update({
      data: {
        enabled: enabled,
      },
      where: {
        id: id,
      },
    });
  };

  deletePiletVersion = async (id: number) => {
    await this._client.piletVersion.delete({
      where: {
        id: id,
      },
    });
  };

  findManyDistinctPiletsVersion = async (
    piletEnabled = true,
  ): Promise<PiletVersionWithPilet[]> => {
    const filterPiletEnabled = piletEnabled
      ? {
          pilet: {
            enabled: true,
          },
        }
      : {};
    const pilets = await this._client.piletVersion.findMany({
      distinct: ['piletId'],
      orderBy: {
        version: 'desc',
      },
      where: {
        enabled: true,
        ...filterPiletEnabled,
      },
      include: {
        pilet: true,
      },
    });
    return pilets;
  };

  findManyWithPiletId = async (
    piletId: number,
  ): Promise<PiletVersionWithPilet[]> => {
    const pilets = await this._client.piletVersion.findMany({
      orderBy: {
        version: 'desc',
      },
      where: {
        //enabled: true,
        pilet: {
          id: piletId,
        },
      },
      include: {
        pilet: true,
      },
    });
    return pilets;
  };
}
