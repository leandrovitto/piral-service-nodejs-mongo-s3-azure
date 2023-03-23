import { PiletVersion, Prisma, PrismaClient } from '@prisma/client';

class PiletVersionRepository {
  //constructor(parameters) {}
  client = new PrismaClient();

  create = async (payload: Omit<PiletVersion, 'id'>): Promise<PiletVersion> => {
    try {
      const p = await this.client.piletVersion.create({
        data: {
          piletId: payload.piletId,
          meta: payload.meta || {},
          version: payload.version,
          root: payload.root,
          integrity: payload.integrity,
          spec: payload.spec,
          enabled: payload.enabled,
        },
      });
      // eslint-disable-next-line no-console
      console.log('------> Record write in DB');
      return p;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          // eslint-disable-next-line no-console
          console.log(
            'There is a unique constraint violation, a new user cannot be created with this name',
          );
        }
      }
      throw e;
    }
  };

  findByPiletIdAndVersion = async (
    piletId: number,
    version: string,
  ): Promise<PiletVersion | null> => {
    const pilet = await this.client.piletVersion.findFirst({
      where: {
        version: version,
        piletId: piletId,
      },
    });
    return pilet;
  };

  disabledOthersPiletVersion = async (id: number, piletId: number) => {
    await this.client.piletVersion.updateMany({
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
}

export { PiletVersionRepository };
