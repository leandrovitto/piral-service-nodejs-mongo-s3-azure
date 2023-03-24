/* eslint-disable no-console */
import { Pilet, PiletVersion } from '@prisma/client';
import { PiletRepository } from '../repository/pilet.repository';
import { PiletVersionRepository } from '../repository/piletVersion.repository';
import { FULL_URL, storage } from '../setting';
import { Providers } from '../types/providers.enum';

class PiletService {
  getPiletsVersion = async () => {
    try {
      const piletRepo = new PiletVersionRepository();

      const provider: string = storage.provider;
      let linkToAttach = '';
      switch (provider) {
        case Providers.LOCAL:
          linkToAttach = `${FULL_URL}/${storage.localSettings.bucket}`;
          break;
        case Providers.AWS:
          linkToAttach = `${storage.awsSettings.url}/${storage.awsSettings.directory}`;
          break;
        case Providers.AZURE:
        default:
          break;
      }

      const pilets = await piletRepo.getPiletsVersion(linkToAttach);
      return pilets;
    } catch (error) {
      throw `Error get pilets version!`;
    }
  };

  createAndActivateNewPiletAndPiletVersion = async (
    piletName: string,
    version: string,
    main: string,
    integrity: string,
    link: string,
  ): Promise<(PiletVersion & { pilet: Pilet }) | null> => {
    const piletRepo = new PiletRepository();
    const piletVRepo = new PiletVersionRepository();

    // Find pilet by name
    let pilet = await piletRepo.findByName(piletName);

    if (!pilet) {
      console.log('Pilet not found, create in progress...');
      //if not found pilet create new record
      pilet = await piletRepo.create({
        name: piletName,
        meta: {},
      });
    }

    // find piletVersion with piletId and pilet Version
    let pV = await piletVRepo.findByPiletIdAndVersion(pilet.id, version);

    if (!pV) {
      console.log(`Pack with name:${piletName}, version ${version} not found`);

      pV = await piletVRepo.create({
        piletId: pilet.id,
        meta: {},
        version: version,
        root: main,
        integrity: integrity,
        spec: 'v2',
        link: link,
        enabled: true,
      });

      await piletVRepo.disabledOthersPiletVersion(pV.id, pilet.id);

      return pV as PiletVersion & { pilet: Pilet };
    } else {
      throw `Pack with name:${piletName}, version ${version} exist! Please increase version!`;
    }
  };
}

export { PiletService };
