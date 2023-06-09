/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
import * as path from 'path';
import { getMessage } from '../helpers';
import { emptyDirectory, extractTar } from '../helpers/files.helper';
import { computeIntegrity } from '../helpers/hash.helper';
import { getContent, getPackageJson } from '../helpers/pilet.helper';
import { mapperPiletsVersion } from '../mapper/piletVersion.mapper';
import { storeFile } from '../providers/storage.provider';
import { PiletService } from '../services/pilet.service';
import { TGZ_OUTPUT__DIRECTORY, UPLOADS__DIRECTORY } from '../setting';
import { PiletVersionWithPilet } from '../types/model';

const getPiletsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const service = new PiletService();

  const items: PiletVersionWithPilet[] = await service.getPiletsVersion();

  const i = mapperPiletsVersion(items);

  res.json({ items: i });
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

          if (pV) {
            try {
              await storeFile(pV);
            } catch (err) {
              await service.deletePiletVersion(pV?.id);
              throw err;
            }

            emptyDirectory(UPLOADS__DIRECTORY);

            res.status(200).json({
              data: pV,
              success: true,
            });
          } else {
            throw getMessage('errors.pilet.saving');
          }
        } catch (err) {
          emptyDirectory(UPLOADS__DIRECTORY);
          console.error(err);

          res.status(400).json({
            success: false,
            message: err,
          });
        }
      })
      .on('error', (err: any) => {
        res.status(400).json({
          success: false,
          message: err,
        });
      });
  } else {
    res.status(422).json({
      success: false,
      message: 'Missed file!',
    });
  }
};

export { getPiletsController, publishPiletController };
