/* eslint-disable no-useless-catch */
/* eslint-disable no-console */
import { PiletVersionWithPilet } from '../types/model';
import * as fs from 'fs';
import {
  BUILD_OUTPUT__DIRECTORY,
  PACKAGE_JSON__FILE,
  TGZ_OUTPUT__DIRECTORY,
  UPLOADS__DIRECTORY,
  storage,
} from '../setting';
import { BlobServiceClient, PublicAccessType } from '@azure/storage-blob';
import { logger } from '../helpers';

const azureSettings = storage.azureSettings;

const blobServiceClient = BlobServiceClient.fromConnectionString(
  azureSettings.connectionString,
);

const azureStorageProvider = async (pilet: PiletVersionWithPilet) => {
  try {
    const destinationPath = `${UPLOADS__DIRECTORY}/${pilet.pilet.name}/${pilet.version}`;
    const extractPath = `${UPLOADS__DIRECTORY}/${TGZ_OUTPUT__DIRECTORY}`;

    if (fs.existsSync(destinationPath)) {
      fs.rmSync(destinationPath, {
        recursive: true,
        force: true,
      });
    }

    fs.mkdirSync(destinationPath, { recursive: true });
    fs.renameSync(`${extractPath}/${BUILD_OUTPUT__DIRECTORY}`, destinationPath);
    fs.renameSync(
      `${extractPath}/${PACKAGE_JSON__FILE}`,
      `${destinationPath}/${PACKAGE_JSON__FILE}`,
    );

    const containerName = azureSettings.containerName;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const createContainerResponse = await containerClient.createIfNotExists({
      access: azureSettings.acl as PublicAccessType,
    });

    logger(
      `Container was created successfully.\n\trequestId:${createContainerResponse.requestId}\n\tURL: ${containerClient.url}`,
    );

    const keys = fs.readdirSync(destinationPath);

    const files = keys.map((key) => {
      const filePath = `${UPLOADS__DIRECTORY}/${pilet.pilet.name}/${pilet.version}/${key}`;
      try {
        if (fs.lstatSync(filePath).isFile()) {
          const fileContent = fs.readFileSync(filePath);
          return {
            Key: key,
            Body: fileContent,
          };
        }
        // eslint-disable-next-line no-empty
      } catch (error) {}
    });

    let errorTrack = null;

    for (const file of files) {
      if (file) {
        const destination = `${pilet.pilet.name}/${pilet.version}/${file.Key}`;
        try {
          // Get a block blob client
          const blockBlobClient =
            containerClient.getBlockBlobClient(destination);

          const uploadBlobResponse = await blockBlobClient.upload(
            file.Body,
            file.Body.length,
          );

          logger(
            `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`,
          );
        } catch (error) {
          logger(`${file.Key} uploaded error.`);
          errorTrack = error;
        }
      }
    }
    if (errorTrack) throw errorTrack;
  } catch (err: unknown) {
    throw err;
  }
};

export default azureStorageProvider;
