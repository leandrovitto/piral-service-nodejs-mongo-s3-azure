import * as fs from 'fs';
import {
  BUILD_OUTPUT__DIRECTORY,
  PACKAGE_JSON__FILE,
  TGZ_OUTPUT__DIRECTORY,
  UPLOADS__DIRECTORY,
  storage,
} from '../setting';
import { PiletVersionWithPilet } from '../types/model';

const localStorageProvider = async (pilet: PiletVersionWithPilet) => {
  const destinationPath = `${storage.localSettings.bucket}/${pilet.pilet.name}/${pilet.version}`;
  const extractPath = `${UPLOADS__DIRECTORY}/${TGZ_OUTPUT__DIRECTORY}`;

  if (fs.existsSync(destinationPath)) {
    fs.rmSync(destinationPath, {
      recursive: true,
      force: true,
    });
  }

  try {
    fs.mkdirSync(destinationPath, { recursive: true });
    fs.renameSync(`${extractPath}/${BUILD_OUTPUT__DIRECTORY}`, destinationPath);
    fs.renameSync(
      `${extractPath}/${PACKAGE_JSON__FILE}`,
      `${destinationPath}/${PACKAGE_JSON__FILE}`,
    );
  } catch (err) {
    throw 'Error Create File in Local Bucket!';
  }
};

export default localStorageProvider;
