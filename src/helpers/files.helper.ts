import * as fs from 'fs';
import * as tar from 'tar';
import * as zlib from 'zlib';
import { Writable } from 'stream';
import { UPLOAD_TMP_DIR_NAME } from '../setting';

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

export { extractTar };