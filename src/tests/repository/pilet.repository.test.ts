import { PiletRepository } from '../../repository/pilet.repository';
import { truncateDB } from '../utility';
import { v4 as uuidv4 } from 'uuid';

describe('Test PiletRepository', () => {
  let piletRepository: PiletRepository;

  const pilet = {
    name: 'pilet-test' + uuidv4(),
    meta: {},
  };

  beforeEach(async () => {
    await truncateDB();
    piletRepository = new PiletRepository();
  });

  test('create', async () => {
    const result = await piletRepository.create(pilet);
    if (result) {
      expect(result?.id).toEqual(1);
    }
  });

  test('findById', async () => {
    const create = await piletRepository.create(pilet);
    const result = await piletRepository.findById(1);
    if (result) {
      expect(create.id).toEqual(result.id);
    }
  });

  test('findByName', async () => {
    const create = await piletRepository.create(pilet);
    const result = await piletRepository.findByName(create.name);
    if (result) {
      expect(create.id).toEqual(result.id);
    }
  });

  test('findMany', async () => {
    await piletRepository.create(pilet);
    await piletRepository.create({
      name: 'pilet-test-2',
      meta: {},
    });
    const result = await piletRepository.findAll();
    expect(result?.length).toEqual(2);
  });

  test('unique Key', async () => {
    await piletRepository.create(pilet);
    try {
      await piletRepository.create(pilet);
    } catch (error) {
      // console.log(error);
    }
    const result = await piletRepository.findAll();
    expect(result?.length).toEqual(1);
  });

  test('updatePiletEnabled', async () => {
    const result = await piletRepository.create(pilet);
    expect(result.enabled).toEqual(true);
    const update = await piletRepository.updatePiletEnabled(result.id, false);
    if (update) {
      expect(update.enabled).toEqual(false);
    }
  });
});
