import { Keys } from '@prisma/client';
import { KeyRepository } from '../../repository/key.repository';
import { generateKey, truncateDB } from '../utility';

describe('Test KeyRepository', () => {
  let keyRepository: KeyRepository;

  const keyObj: Keys = {
    key: generateKey(),
    id: 0,
    createdAt: null,
    updatedAt: null,
  };

  beforeEach(async () => {
    await truncateDB();
    keyRepository = new KeyRepository();
  });

  test('findAll', async () => {
    const result = await keyRepository.findAll();
    if (result) {
      expect(result.length).toEqual(0);
    }
  });

  test('create', async () => {
    const result = await keyRepository.create(keyObj);
    if (result) {
      expect(result.id).toEqual(1);
    }
  });

  test('findAll with Creation', async () => {
    await keyRepository.create(keyObj);
    const key2Obj: Keys = {
      key: generateKey(),
      id: 0,
      createdAt: null,
      updatedAt: null,
    };
    await keyRepository.create(key2Obj);
    const result = await keyRepository.findAll();
    if (result) {
      expect(result.length).toEqual(2);
    }
  });

  test('findKeyByKey', async () => {
    const key = generateKey();
    await keyRepository.create(keyObj);
    const result = await keyRepository.findKeyByKey(key);
    if (result) {
      expect(result.key).toEqual(key);
    }
  });

  test('unique Key', async () => {
    await keyRepository.create(keyObj);
    try {
      await keyRepository.create(keyObj);
    } catch (error) {
      // console.log(error);
    }
    const result = await keyRepository.findAll();
    if (result) {
      expect(result.length).toEqual(1);
    }
  });
});
