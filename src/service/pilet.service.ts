/* eslint-disable-next-line no-console */
import { PiletVersion } from '@prisma/client';
import { PiletRepository } from '../repository/pilet.repository';
import { PiletVersionRepository } from '../repository/piletVersion.repository';

class PiletService {
  createAndActivateNewPiletAndPiletVersion = async (
    piletName: string,
    version: string,
    main: string,
    integrity: string,
  ): Promise<PiletVersion | null> => {
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
        enabled: true,
      });

      await piletVRepo.disabledOthersPiletVersion(pV.id, pilet.id);

      return pV;
    } else {
      throw `Pack with name:${piletName}, version ${version} exist! Please increase version!`;
    }
  };
}

export { PiletService };
