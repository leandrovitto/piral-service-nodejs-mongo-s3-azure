import * as fs from 'fs';
import { PackageData } from '../types';

const getPackageJson = (path: string): PackageData => {
  try {
    const fileName = `package.json`;
    const data = fs.readFileSync(`${path}/${fileName}`, {
      encoding: 'utf8',
      flag: 'r',
    });
    return JSON.parse(data);
  } catch (e) {
    throw 'LOG::packages.json miss!';
  }
};

const getContent = (path: string, fileName: string) => {
  const data = fs.readFileSync(`${path}/${fileName}`, {
    encoding: 'utf8',
  });
  return data.toString();
};

const extractPiletMetadata = (
  data: PackageData,
  file: string,
): {
  version: string;
  name: string;
  link: string;
} => {
  const { version, name, main } = data;

  return {
    name,
    version,
    link: `${file}/${main}`,
  };
};

export { extractPiletMetadata, getContent, getPackageJson };