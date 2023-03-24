/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { Pilet, PiletVersion } from '@prisma/client';
import { FULL_URL, storage } from '../setting';
import { Providers } from '../types/providers.enum';
import { PiletVersionWithPilet } from '../types/model';

const mapperPiletsVersion = (items: PiletVersionWithPilet[]) => {
  const i = items?.map((piletVersion) => {
    return mapperPiletVersion(piletVersion);
  });

  return i;
};

const mapperPiletVersion = (piletVersion: PiletVersionWithPilet) => {
  const {
    pilet: { name },
    id,
    version,
    spec,
    link,
    integrity,
  } = piletVersion;

  const reg = /([_-])/g;

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

  return {
    id: id,
    name: name,
    version: version,
    link: `${linkToAttach}${link}`,
    requireRef: 'pr_' + name.replace(reg, ''),
    integrity: integrity,
    // parent: '3.32.1',
    spec: spec,
  };
};

export { mapperPiletVersion, mapperPiletsVersion };
