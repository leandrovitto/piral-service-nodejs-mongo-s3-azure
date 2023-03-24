/* eslint-disable no-console */
import { PiletRepository } from '../repository/pilet.repository';
import { PiletVersionRepository } from '../repository/piletVersion.repository';
import { PiletVersionWithPilet } from '../types/model';

class PiletService {
  getPiletsVersion = async (): Promise<PiletVersionWithPilet[]> => {
    try {
      const piletVRepo = new PiletVersionRepository();
      const pilets = await piletVRepo.findManyDistinctPiletsVersion();
      return pilets;
    } catch (error) {
      throw `Error get pilets version!`;
    }
  };

  updatePiletVersionEnabled = async (id: number, enabled = true) => {
    try {
      const piletVRepo = new PiletVersionRepository();
      await piletVRepo.updatePiletVersionEnabled(id, enabled);
    } catch (error) {
      throw `Error update pilet version enabled!`;
    }
  };

  createAndActivateNewPiletAndPiletVersion = async (
    piletName: string,
    version: string,
    main: string,
    integrity: string,
    link: string,
  ): Promise<PiletVersionWithPilet | null> => {
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
        enabled: false,
      });

      await piletVRepo.disabledOthersPiletVersion(pV.id, pilet.id);

      return pV as PiletVersionWithPilet;
    } else {
      throw `Pack with name:${piletName}, version ${version} exist! Please increase version!`;
    }
  };
}

export { PiletService };
