import * as fs from 'fs';
import { PackageData, PackageFiles } from '../types';

const getPackageJson = (path: string): PackageData => {
  const fileName = `package.json`;
  const data = fs.readFileSync(`${path}/${fileName}`, 'utf8');
  return JSON.parse(data);
};

const getContent = (path: string, fileName: string) => {
  const data = fs.readFileSync(`${path}/${fileName}`, 'utf8');
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

export { extractPiletMetadata, getPackageJson, getContent };
