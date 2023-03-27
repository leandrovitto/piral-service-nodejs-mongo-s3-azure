/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
import { KeyRepository } from '../repository/key.repository';
import { authKeys } from '../setting';
import { KeyProviders } from '../types/keysProviders.enum';

class KeyService {
  getKeys = async (): Promise<string[]> => {
    const { provider, envKeys, defaultKeys } = authKeys;

    let cachedKeys: string[] = [];

    switch (provider) {
      case KeyProviders.ENV:
        cachedKeys = envKeys.split(',');
        break;
      case KeyProviders.DATABASE:
        const keyRepository = new KeyRepository();
        const k = await keyRepository.findAll();
        cachedKeys = k ? k?.map((i) => i.key) : [];
        break;
      default:
        cachedKeys = defaultKeys;
        break;
    }

    return cachedKeys;
  };
}

export { KeyService };
