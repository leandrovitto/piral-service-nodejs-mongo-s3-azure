import { Pilet, PiletVersion, Prisma, PrismaClient } from '@prisma/client';

class PiletVersionRepository {
  //constructor(parameters) {}
  client = new PrismaClient();

  create = async (
    payload: Omit<PiletVersion, 'id'>,
  ): Promise<PiletVersion & { pilet: Pilet }> => {
    try {
      const p = await this.client.piletVersion.create({
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

  getPiletsVersion = async (linkToAttach = ''): Promise<unknown[] | null> => {
    const xprisma = this.client.$extends({
      result: {
        piletVersion: {
          link: {
            needs: {
              link: true,
            },
            compute(pV) {
              const link = `${linkToAttach}${pV.link}`;
              return link;
            },
          },
        },
      },
    });

    const pilets = await xprisma.piletVersion.findMany({
      distinct: ['piletId'],
      orderBy: {
        version: 'desc',
      },
      where: {
        enabled: true,
        pilet: {
          enabled: true,
        },
      },
      select: {
        id: true,
        piletId: true,
        version: true,
        integrity: true,
        spec: true,
        link: true,
        pilet: {
          select: {
            name: true,
          },
        },
      },
    });

    return pilets;
  };
}

export { PiletVersionRepository };
