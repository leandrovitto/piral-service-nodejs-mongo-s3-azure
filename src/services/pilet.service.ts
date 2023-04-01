/* eslint-disable no-console */
import { getMessage, logger } from '../helpers';
import { PiletRepository } from '../repository/pilet.repository';
import { PiletVersionRepository } from '../repository/piletVersion.repository';
import { PILET_VERSION } from '../setting';
import { PiletVersionWithPilet } from '../types/model';

class PiletService {
  getPiletsVersion = async (): Promise<PiletVersionWithPilet[]> => {
    try {
      const piletVersionRepository = new PiletVersionRepository();
      const pilets =
        await piletVersionRepository.findManyDistinctPiletsVersion();
      return pilets;
    } catch (error) {
      throw getMessage('errors.piletVersion.get');
    }
  };

  updatePiletVersionEnabled = async (id: number, enabled = true) => {
    try {
      const piletVersionRepository = new PiletVersionRepository();
      await piletVersionRepository.updatePiletVersionEnabled(id, enabled);
    } catch (error) {
      throw getMessage('errors.piletVersion.update');
    }
  };

  deletePiletVersion = async (id: number) => {
    try {
      const piletVersionRepository = new PiletVersionRepository();
      await piletVersionRepository.deletePiletVersion(id);
    } catch (error) {
      throw getMessage('errors.piletVersion.delete');
    }
  };

  createAndActivateNewPiletAndPiletVersion = async (
    piletName: string,
    version: string,
    main: string,
    integrity: string,
    link: string,
  ): Promise<PiletVersionWithPilet | null> => {
    // Find pilet by name
    const piletRepository = new PiletRepository();
    let pilet = await piletRepository.findByName(piletName);

    if (!pilet) {
      getMessage('errors.pilet.not_found');
      //if not found pilet create new record
      pilet = await piletRepository.create({
        name: piletName,
        meta: {},
      });
    }
    const piletVersionRepository = new PiletVersionRepository();
    // find piletVersion with piletId and pilet Version
    let pV = await piletVersionRepository.findByPiletIdAndVersion(
      pilet.id,
      version,
    );

    if (!pV) {
      logger(`Pack with name:${piletName}, version ${version} not found`);

      pV = await piletVersionRepository.create({
        piletId: pilet.id,
        meta: {},
        version: version,
        root: main,
        integrity: integrity,
        spec: PILET_VERSION,
        link: link,
        enabled: true,
      });

      await piletVersionRepository.disabledOthersPiletVersion(pV.id, pilet.id);

      return pV as PiletVersionWithPilet;
    } else {
      throw `Pilet with name:${piletName}, version ${version} exist! Please increase version!`;
    }
  };
}

export { PiletService };
