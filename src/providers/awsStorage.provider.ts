/* eslint-disable no-useless-catch */
/* eslint-disable no-console */
import {
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import * as fs from 'fs';
import {
  BUILD_OUTPUT__DIRECTORY,
  PACKAGE_JSON__FILE,
  TGZ_OUTPUT__DIRECTORY,
  UPLOADS__DIRECTORY,
  storage,
} from '../setting';
import { PiletVersionWithPilet } from '../types/model';
import * as mimeTypes from 'mime-types';

const awsSettings = storage.awsSettings;

const awsStorageProvider = async (pilet: PiletVersionWithPilet) => {
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

    const s3Client = new S3Client({ region: awsSettings.region });

    console.log(`Uploading files from ${destinationPath} to AWS S3\n`);
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
        const destination = `${awsSettings.directory}/${pilet.pilet.name}/${pilet.version}/${file.Key}`;
        try {
          await s3Client.send(
            new PutObjectCommand({
              Bucket: awsSettings.bucket,
              Body: file.Body,
              Key: destination,
              ContentDisposition: 'inline',
              ContentType: mimeTypes.lookup(file.Key) as string,
              ACL: awsSettings.acl,
            }),
          );
          console.log(`${file.Key} uploaded successfully.`);
        } catch (error) {
          console.log(`${file.Key} uploaded error.`);
          errorTrack = error;
        }
      }
    }
    if (errorTrack) throw errorTrack;
  } catch (err: unknown) {
    if (err instanceof S3ServiceException) {
      throw err.message;
    }
    throw err;
  }
};

export default awsStorageProvider;
