/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { extractTar } from '../helpers/files.helper';
import { computeIntegrity } from '../helpers/hash';
import { getContent, getPackageJson } from '../helpers/pilet.helper';
import { PiletService } from '../services/pilet.service';
import { TGZ_OUTPUT__DIRECTORY, UPLOADS__DIRECTORY } from '../setting';
import { PackageData } from '../types';
import { storeFile } from '../providers/storage.provider';
import { PiletVersionWithPilet } from '../types/model';

const prisma = new PrismaClient();

const getPiletsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const service = new PiletService();
  res.json({ items: await service.getPiletsVersion() });
};

const publishPiletController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.file) {
    const file = req.file;
    const filePath = file.path;

    const extractPath = `${UPLOADS__DIRECTORY}/${TGZ_OUTPUT__DIRECTORY}`;

    try {
      extractTar(filePath)
        .on('close', async () => {
          try {
            const packageData = getPackageJson(extractPath);
            const { version, name, main } = packageData;

            const mainContent = main ? getContent(extractPath, main) : '';
            const integrity = computeIntegrity(mainContent);

            const service = new PiletService();

            const fileName = path.basename(main as string);
            const link = `/${name}/${version}/${fileName}`;

            const pV = await service.createAndActivateNewPiletAndPiletVersion(
              name,
              version,
              main ? main : '',
              integrity,
              link,
            );

            await storeFile(pV as PiletVersionWithPilet);
            deleteTmpFiles(extractPath, filePath);

            res.status(200).json({
              data: pV,
              success: true,
            });
          } catch (err) {
            console.error(err);

            deleteTmpFiles(extractPath, filePath);

            res.status(400).json({
              success: false,
              message: err,
            });
          }
        })
        .on('error', (err) => {
          throw err;
        });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err,
      });
    }
  }
};

const deleteTmpFiles = (path: string, filePath: string) => {
  //Delete Old Path
  fs.rmSync(path, {
    recursive: true,
    force: true,
  });
  fs.rmSync(filePath);
};

const seveInLocalStorage = async (
  extractPath: string,
  filePath: string,
  packageData: PackageData,
) => {
  // Delete old extractPath
  //fs.rmSync(extractPath, { recursive: true, force: true });
  //fs.mkdirSync(extractPath);

  if (packageData) {
    const { version, name, main } = packageData;
    const destinationPath = `${UPLOADS__DIRECTORY}/${name}/${version}`;

    if (fs.existsSync(destinationPath)) {
      //Delete Old Path
      deleteTmpFiles(extractPath, filePath);
      /* return res.status(400).json({
        success: false,
        message: 'Directory Exist!',
      }); */
    }

    // eslint-disable-next-line no-useless-catch
    try {
      fs.mkdirSync(destinationPath, { recursive: true });
      fs.renameSync(extractPath + '/dist', destinationPath);
      fs.renameSync(
        extractPath + '/package.json',
        destinationPath + '/package.json',
      );
      //fs.renameSync(extractPath, destinationPath);
      // eslint-disable-next-line no-console
      console.log('Successfully moved the file!');
      //fs.renameSync(destinationPath + '/dist', destinationPath);

      //Delete Old Path
      deleteTmpFiles(extractPath, filePath);
      // eslint-disable-next-line no-console
      console.log('Record write in DB');

      /* res.status(200).json({
        file: packageData.version,
        success: true,
      }); */
    } catch (err) {
      /* res.status(400).json({
        success: false,
        message: err,
      }); */
    }
  }
};

export { getPiletsController, publishPiletController };
