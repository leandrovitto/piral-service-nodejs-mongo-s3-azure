import * as fs from 'fs';
import * as tar from 'tar';
import * as zlib from 'zlib';
import path from 'path';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma, PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import {
  extractPiletMetadata,
  getContent,
  getPackageJson,
} from '../helpers/pilet.helper';
import { FULL_URL, TAR_DIR_NAME, UPLOAD_TMP_DIR_NAME } from '../setting';
import { Writable } from 'stream';
import { computeIntegrity } from '../helpers/hash';
import { PackageData } from '../types';

const prisma = new PrismaClient();

const getPilets = async (req: Request, res: Response, next: NextFunction) => {
  const xprisma = prisma.$extends({
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
  });

  const pilets = await xprisma.pilet.findMany({
    orderBy: {
      id: 'asc',
    },
    where: {
      visible: true,
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

    // Delete old extractPath
    //fs.rmSync(extractPath, { recursive: true, force: true });
    //fs.mkdirSync(extractPath);

    extractTar(filePath)
      .on('close', () => {
        const packageData = getPackageJson(extractPath);

        if (packageData) {
          const { version, name, main } = packageData;
          const destinationPath = `${UPLOAD_TMP_DIR_NAME}/${name}/${version}`;

          if (fs.existsSync(destinationPath)) {
            //Delete Old Path
            deleteTmpFiles(extractPath, filePath);
            return res.status(400).json({
              success: false,
              message: 'Directory Exist!',
            });
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
            saveInformationIntoDB(destinationPath, packageData);
            // eslint-disable-next-line no-console
            console.log('Record write in DB');

            res.status(200).json({
              file: packageData.version,
              success: true,
            });
          } catch (err) {
            res.status(400).json({
              success: false,
              message: err,
            });
          }
        }

        const newPathWithVersion = `${file.destination}${packageData.name}/${packageData.version}`;

        /*  const currentPath = path.join(__dirname, 'your-file.png');
        const newPath = path.join(__dirname, 'your-directory', 'your-file.png'); */

        //Delete Old Path
        /* 
        fs.rmSync(`${file.destination}${packageData.name}`, {
          recursive: true,
          force: true,
        });
        fs.rmSync(newPathWithVersion, { recursive: true, force: true });
        fs.mkdirSync(`${file.destination}${packageData.name}`);
        fs.mkdirSync(newPathWithVersion); */

        /* extractTar(path, newPathWithVersion)
          .on('close', () => {
            fs.rmSync(extractPath, { recursive: true, force: true });
            fs.rmSync(path);
            saveInformationIntoDB(`${newPathWithVersion}/${TAR_DIR_NAME}`);
            res.status(200).json({
              file: packageData.version,
              success: true,
            });
          })
          .on('error', (err) => {
            fs.rmSync(extractPath, { recursive: true, force: true });
            fs.rmSync(path);
            res.status(400).json({
              success: false,
              message: err,
            });
          }); */
      })
      .on('error', (err) => {
        res.status(400).json({
          success: false,
          message: err,
        });
      });
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

const extractTar = (
  readPath: string,
  extractPath = UPLOAD_TMP_DIR_NAME,
): Writable => {
  const stream = fs
    .createReadStream(readPath)
    .pipe(zlib.createGunzip())
    .pipe(tar.extract({ cwd: extractPath }));
  return stream;
};

const saveInformationIntoDB = async (
  path: string,
  packageData: PackageData,
) => {
  //console.log(path);
  const meta = extractPiletMetadata(packageData, path);

  if (packageData) {
    const { main, name, version } = packageData;
    const mainContent = main ? getContent(path, 'index.js') : '';
    const integrity = computeIntegrity(mainContent);

    try {
      await prisma.pilet.create({
        data: {
          name: name,
          meta: meta,
          version: version,
          root: main,
          integrity: integrity,
          visible: true,
        },
      });
      // eslint-disable-next-line no-console
      console.log('Record write in DB');
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          // eslint-disable-next-line no-console
          console.log(
            'There is a unique constraint violation, a new user cannot be created with this name',
          );
        }
      }
      throw e;
    }
  }
};

export { getPilets, publishPilet };
