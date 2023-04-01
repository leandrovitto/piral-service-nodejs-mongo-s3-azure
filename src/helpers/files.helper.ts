import * as fs from 'fs';
import * as tar from 'tar';
import * as zlib from 'zlib';
import * as path from 'path';
import { Writable } from 'stream';
import { UPLOADS__DIRECTORY } from '../setting';

const extractTar = (
  readPath: string,
  extractPath = UPLOADS__DIRECTORY,
): Writable => {
  const stream = fs
    .createReadStream(readPath)
    .pipe(zlib.createGunzip())
    .pipe(tar.extract({ cwd: extractPath, preserveOwner: true }));
  return stream;
};

const emptyDirectory = (directory: string) => {
  const dir = fs.readdirSync(directory);
  for (const file of dir) {
    fs.rmSync(path.join(directory, file), {
      recursive: true,
      force: true,
    });
  }
};

export { extractTar, emptyDirectory };
