/* eslint-disable no-console */
import { storage } from '../setting';
import { PiletVersionWithPilet } from '../types/model';

const awsStorageProvider = async (pilet: PiletVersionWithPilet) => {
  const destinationPath = `${storage.localSettings.bucket}/${pilet.pilet.name}/${pilet.version}`;
  // const extractPath = `${UPLOADS__DIRECTORY}/${TGZ_OUTPUT__DIRECTORY}`;

  console.log('awsStorageProvider' + destinationPath);
};

export default awsStorageProvider;
