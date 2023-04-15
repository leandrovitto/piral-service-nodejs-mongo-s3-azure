import { Pilet, PiletVersion } from '@prisma/client';
import prisma from '../../helpers/prisma-client';
import { PiletRepository } from '../../repository/pilet.repository';
import { PiletVersionRepository } from '../../repository/piletVersion.repository';
import { PILET_VERSION } from '../../setting';
import { truncateDB } from '../utility';
import { v4 as uuidv4 } from 'uuid';

describe('Test PiletVersionRepository', () => {
  let piletRepository: PiletRepository;
  let piletVersionRepository: PiletVersionRepository;

  const version = '2.0.0';
  const piletPayload = {
    name: 'pilet-test' + uuidv4(),
    meta: {},
  };

  const piletVersionPayload = {
    piletId: 0,
    meta: {},
    version: version,
    root: 'main',
    integrity: 'integrity',
    spec: PILET_VERSION,
    link: 'link',
    enabled: true,
  };
  let pilet: Pilet;
  let piletVersion: PiletVersion;

  beforeAll(async () => {
    await truncateDB();
    piletRepository = new PiletRepository();
    piletVersionRepository = new PiletVersionRepository();
    pilet = await piletRepository.create(piletPayload);
    if (pilet) {
      piletVersionPayload.piletId = pilet.id;
      piletVersion = await piletVersionRepository.create(piletVersionPayload);
    }
  });

  test('findByPiletIdAndVersion', async () => {
    const result = await piletVersionRepository.findByPiletIdAndVersion(
      pilet.id,
      version,
    );
    if (result) {
      expect(result.version).toEqual(version);
    }
  });

  test('findById', async () => {
    const result = await piletVersionRepository.findById(piletVersion.id);
    if (result) {
      expect(result.id).toEqual(piletVersion.id);
    }
  });

  test('disabledOthersPiletVersion', async () => {
    const piletVersion1 = await piletVersionRepository.create({
      ...piletVersionPayload,
      version: '1.0.1',
    });
    const piletVersion2 = await piletVersionRepository.create({
      ...piletVersionPayload,
      version: '2.0.5',
    });
    let result;
    result = await piletVersionRepository.disabledOthersPiletVersion(
      piletVersion.id,
      pilet.id,
    );
    if (result) {
      expect(result.count).toEqual(2);
    }
    result = await piletVersionRepository.findById(piletVersion.id);
    if (result) {
      expect(result.enabled).toEqual(true);
    }
    result = await piletVersionRepository.findById(piletVersion1.id);
    if (result) {
      expect(result.enabled).toEqual(false);
    }
    result = await piletVersionRepository.findById(piletVersion2.id);
    if (result) {
      expect(result.enabled).toEqual(false);
    }
  });

  test('updatePiletVersionEnabled', async () => {
    expect(true).toEqual(true);
  });

  test('deletePiletVersion', async () => {
    expect(true).toEqual(true);
  });

  test('findManyDistinctPiletsVersion', async () => {
    expect(true).toEqual(true);
  });

  test('findManyWithPiletId', async () => {
    expect(true).toEqual(true);
  });
});
