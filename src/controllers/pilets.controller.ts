/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable-next-line no-console */
import * as fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { computeIntegrity } from '../helpers/hash';
import {
  extractPiletMetadata,
  getContent,
  getPackageJson,
} from '../helpers/pilet.helper';
import { TAR_DIR_NAME, UPLOAD_TMP_DIR_NAME } from '../setting';
import { PackageData } from '../types';
import { extractTar } from '../helpers/files.helper';
import { PiletRepository } from '../repository/pilet.repository';
import { PiletVersionRepository } from '../repository/piletVersion.repository';
import { PiletService } from '../service/pilet.service';

const prisma = new PrismaClient();

const getPilets = async (req: Request, res: Response, next: NextFunction) => {
  /* const xprisma = prisma.$extends({
    result: {
      pilet: {
        link: {
          needs: { version: true, root: true, name: true },
          compute(pilet) {
            const fileName = path.basename(pilet.root as string);
            return `${FULL_URL}/${UPLOAD_TMP_DIR_NAME}/${pilet.name}/${pilet.version}/${fileName}`;
          },
        },
      },
    },
  }); */

  const pilets = await prisma.piletVersion.findMany({
    distinct: ['piletId'],
    orderBy: {
      version: 'desc',
    },
    where: {
      enabled: true,
      pilet: {
        enabled: true,
      },
    },
    select: {
      id: true,
      piletId: true,
      version: true,
      integrity: true,
      spec: true,
      pilet: {
        select: {
          name: true,
        },
      },
    },
  });

  res.json({ items: pilets });
};

const publishPilet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.file) {
    const file = req.file;
    const filePath = file.path;

    const extractPath = `${UPLOAD_TMP_DIR_NAME}/${TAR_DIR_NAME}`;

    try {
      extractTar(filePath)
        .on('close', async () => {
          try {
            const packageData = getPackageJson(extractPath);
            const { version, name, main } = packageData;

            const mainContent = main ? getContent(extractPath, main) : '';
            const integrity = computeIntegrity(mainContent);

            const service = new PiletService();

            const pV = await service.createAndActivateNewPiletAndPiletVersion(
              name,
              version,
              main ? main : '',
              integrity,
            );

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
    const destinationPath = `${UPLOAD_TMP_DIR_NAME}/${name}/${version}`;

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

export { getPilets, publishPilet };
