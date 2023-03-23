import * as fs from 'fs';
import * as tar from 'tar';
import * as zlib from 'zlib';
import { Writable } from 'stream';
import { UPLOADS__DIRECTORY } from '../setting';

const extractTar = (
  readPath: string,
  extractPath = UPLOADS__DIRECTORY,
): Writable => {
  const stream = fs
    .createReadStream(readPath)
    .pipe(zlib.createGunzip())
    .pipe(tar.extract({ cwd: extractPath }));
  return stream;
};

export { extractTar };
